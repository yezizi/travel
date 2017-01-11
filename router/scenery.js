var express = require('express')
var mysql = require('../util/mysql')

var router = express.Router()

// 搜索结果数
router.route('/search/counter')
  .post(function (request, response) {
    mysql.pool.getConnection(function (error, connection) {
      if (error) {
        console.error(error)
        response.send({message: 'ERROR_ON_CONNECT_TO_DATABASE'})
        return
      }
      let sql = `
      select id, count(*) as counter
      from scenery as s, (
        select k, v from kv where c = "景点类别"
      ) as c, (
        select k, v from kv where c = "景点地区"
      ) as r
      where c.k = s.category_id
        and r.k = s.region_id
        and (
          locate(?, c.v) > 0
          or locate(?, r.v) > 0
          or locate(?, season) > 0
          or locate(?, name) > 0
          or locate(?, location) > 0
          or locate(?, intro) > 0
        )
      limit 1
      `
      let param = [
        request.body.search
        , request.body.search
        , request.body.search
        , request.body.search
        , request.body.search
        , request.body.search
      ]
      connection.query({sql: sql, values: param}, function (error, data) {
        connection.release()
        if (error) {
          console.error(error)
          response.send({message: 'QUERY_FAILED'})
          return
        }
        response.send(data[0])
      })
    })
  })

// 搜索结果
router.route('/search').post(function (request, response) {
  mysql.pool.getConnection(function (error, connection) {
    if (error) {
      console.error(error)
      response.send({message: 'ERROR_ON_CONNECT_TO_DATABASE'})
      return
    }
    let sql = `
    select id, c.v as category, r.v as region, season, name, location, intro, pic_1, pic_2
    from scenery as s, (
      select k, v from kv where c = "景点类别"
    ) as c, (
      select k, v from kv where c = "景点地区"
    ) as r
    where c.k = s.category_id
      and r.k = s.region_id
      and (
        locate(?, c.v) > 0
        or locate(?, r.v) > 0
        or locate(?, season) > 0
        or locate(?, name) > 0
        or locate(?, location) > 0
        or locate(?, intro) > 0
      )
    `
    let param = [
      request.body.search
      , request.body.search
      , request.body.search
      , request.body.search
      , request.body.search
      , request.body.search
    ]
    connection.query({sql: sql, values: param}, function (error, data) {
      connection.release()
      if (error) {
        console.error(error)
        response.send({message: 'QUERY_FAILED'})
        return
      }
      response.send(data)
    })
  })
})

// 图集
router.route('/:id/picset')
  .get(function (request, response) {
    mysql.pool.getConnection(function (error, connection) {
      if (error) {
        console.error(error)
        response.send({message: 'ERROR_ON_CONNECT_TO_DATABASE'})
        return
      }
      let sql = `
      select id, item_id, category, url, name, intro, date, time
      from picture_set
      where item_id = ?
        and category = 'scenery'
      `
      let param = [parseInt(request.params.id)]
      connection.query({sql: sql, values: param}, function (error, data) {
        connection.release()
        if (error) {
          console.error(error)
          response.send({message: 'ERROR_ON_QUERY'})
          return
        }
        response.send(data)
      })
    })
  })

// 相关吃喝
router.route('/wad/:id/:counter')
  .get(function (request, response) {
    mysql.pool.getConnection(function (error, connection) {
      if (error) {
        console.error(error)
        response.send({message: 'ERROR_ON_CONNECT_TO_DATABASE'})
        return
      }
      let sql = `
      select id, name, alias, taste, area, history, propose, intro, pic_1, pic_2
      from wine_and_dine as wad
        , (select location from scenery where id = ?) as s
      where locate(s.location, wad.area) > 0
      limit ?
      `
      let param = [parseInt(request.params.id), parseInt(request.params.counter)]
      connection.query({sql: sql, values: param}, function (error, data) {
        connection.release()
        if (error) {
          console.error(error)
          response.send({message: 'QUERY_FAILED'})
          return
        }
        response.send(data)
      })
    })
  })

// 季节
router.route('/season/:id')
  .get(function (req, res) {
    mysql.pool.getConnection(function (error, connection) {
      if (error) {
        console.error(error)
        res.send({message: 'ERROR_ON_CONNECT_TO_DATABASE'})
        return
      }
      let sql = `
      select id, c.v as category, r.v as region, season, name, location, intro, pic_1, pic_2
      from scenery as s, (
        select k, v from kv where c = "景点类别"
      ) as c, (
        select k, v from kv where c = "景点地区"
      ) as r
      where c.k = s.category_id
        and r.k = s.region_id
        and locate(?, s.season) > 0
      `
      let season = ''
      if (req.params.id == 1) {
        season = '春'
      } else if (req.params.id == 2) {
        season = '夏'
      } else if (req.params.id == 3) {
        season = '秋'
      } else if (req.params.id == 4) {
        season = '冬'
      } else {
        console.log('未指定季节')
        res.send({message: 'NO_SUCH_SEASON'})
        return
      }
      let param = [season]
      connection.query({sql: sql, values: param}, function (error, data) {
        connection.release()
        if (error) {
          console.error(error)
          res.send({message: 'QUERY_FAILED'})
          return
        }
        res.send(data)
      })
    })
  })

// 热门景点
router.route('/popular/:counter')
  .get(function (request, response) {
    mysql.pool.getConnection(function (error, connection) {
      if (error) {
        console.error(error)
        response.send({message: 'ERROR_ON_CONNECT_TO_DATABASE'})
        return
      }
      let sql = `
      select s.id, s.season, s.name, s.location, s.intro, s.pic_1, s.pic_2
        , c.v as category, r.v as region
        , count(*) counter
      from user_log as l, scenery as s
        , (select k, v from kv where c = '景点类别') as c
        , (select k, v from kv where c = '景点地区') as r
      where s.id = l.item_id
        and l.category = 'scenery'
        and s.category_id = c.k
        and s.region_id = r.k
      group by s.id
      order by counter desc
      limit ?
      `
      let param = [parseInt(request.params.counter)]
      connection.query({sql: sql, values: param}, function (error, data) {
        connection.release()
        if (error) {
          console.error(error)
          response.send({message: 'QUERY_FAILED'})
          return
        }
        response.send(data)
      })
    })
  })

// 随机景点
router.route('/random')
  .get(function (request, response) {
    mysql.pool.getConnection(function (error, connection) {
      if (error) {
        console.error(error)
        response.send({message: 'ERROR_ON_CONNECT_TO_DATABASE'})
        return
      }
      let sql = `
      select s.id, c.v as category, r.v as region, season, name, location, intro, pic_1, pic_2
      from scenery as s
        join (select round(rand() * (select max(id) from scenery)) as id_t) as scenery_t,
        (select k, v from kv where c = '景点类别') as c,
        (select k, v from kv where c = '景点地区') as r
      where s.id >= scenery_t.id_t
        and s.category_id = c.k
        and s.region_id = r.k
      limit 1
      `
      connection.query({sql: sql, values: []}, function (error, data) {
        connection.release()
        if (error) {
          console.error(error)
          response.send({message: 'QUERY_FAILED'})
          return
        }
        response.send(data[0])
      })
    })
  })

// 指定id的单个景点数据
router.route('/:id')
  .get(function (request, response) {
    mysql.pool.getConnection(function (error, connection) { if (error) {
        console.error(error)
        response.send({message: 'ERROR_ON_CONNECT_TO_DATABASE'})
        return
      }
      let sql = `
      select id, c.v as category, r.v as region, season, name, location, intro, pic_1, pic_2
      from scenery as s, (
        select k, v from kv where c = '景点类别'
      ) as c, (
        select k, v from kv where c = '景点地区'
      ) as r
      where s.id = ?
        and c.k = s.category_id
        and r.k = s.region_id
      `
      let param = [parseInt(request.params.id)]
      connection.query({sql: sql, values: param}, function (error, data) {
        connection.release()
        if (error) {
          console.error(error)
          response.send({message: 'QUERY_FAILED'})
          return
        }
        response.send(data)
      })
    })
  })

// 指定地区的所有景点
router.route('/region/:id')
  .get(function (request, response) {
    mysql.pool.getConnection(function (error, connection) {
      if (error) {
        console.log(error)
        response.send({message: 'ERROR_ON_CONNECT_TO_DATABASE'})
        return
      }
      let sql = `
      select id, c.v as category, r.v as region, season, name, location, intro, pic_1, pic_2
      from scenery as s, (
        select k, v from kv where c = "景点类别"
      ) as c, (
        select k, v from kv where c = "景点地区" and k = ?
      ) as r
      where c.k = s.category_id
        and r.k = s.region_id
      `
      let param = [parseInt(request.params.id)]
      connection.query({sql: sql, values: param}, function (error, data) {
        connection.release()
        if (error) {
          console.error(error);
          response.send({message: 'QUERY_FAILED'})
          return
        }
        response.send(data)
      })
    })
  })

// 指定类别的所有景点
router.route('/category/:id')
  .get(function (req, res) {
    mysql.pool.getConnection(function (error, connection) {
      if (error) {
        console.log(error)
        res.send({message: 'ERROR_ON_CONNECT_TO_DATABASE'})
        return
      }
      let sql = `
      select id, c.v as category, r.v as region, season, name, location, intro, pic_1, pic_2
      from scenery s
        , (select k, v from kv where c = "景点类别" and k = ?) as c
        , (select k, v from kv where c = "景点地区") as r
      where r.k = s.region_id
        and c.k = s.category_id
      `
      let param = [parseInt(req.params.id)]
      connection.query({sql: sql, values: param}, function (error, data) {
        connection.release()
        if (error) {
          console.log(error)
          res.send({message: 'QUERY_FAILED'})
          return
        }
        res.send(data)
      })
    })
  })

module.exports = router
