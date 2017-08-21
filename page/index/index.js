// // 获取应用实例
// const app = getApp();

// Page({
//   data: {
//     motto: 'Hello World 4',
//     userInfo: {},
//   },
//   // 事件处理函数
//   bindViewTap() {
//     my.navigateTo({
//       url: '../logs/logs',
//     });
//   },
//   onLoad() {
//     console.log('onLoad');
//     // 调用应用实例的方法获取全局数据
//     app.getUserInfo((userInfo) => {
//       console.warn(`==== ${JSON.stringify(userInfo)}`);
//       // 更新数据
//       this.setData({
//         userInfo,
//       });
//     });
//   },
// });
//index.js
import {
  formatTime
} from '../../utils/util';

const app = getApp();
var TODAY = formatTime(new Date());

Page({
  data: {
    todos: [],
    allCompleted: true,
    input: '',
    userInfo: {},
    color:['red', 'yellow', 'blue', 'green']
  },
  bindViewTap() {
    my.navigateTo({
      url: '../logs/logs',
    });
  },
  save: function() {
    var todos_history = my.getStorageSync({
        key: 'todos_history'
        }
      );
    var j = 0;

    if (typeof todos_history != 'object') {
      todos_history = [];
    }

    for (var i = 0; i < todos_history.length; i++) {
      if (todos_history[i].date == TODAY) {
        todos_history[i].todos = this.data.todos;
      } else {
        j++;
      }
    }

    if(j == todos_history.length) {
      todos_history.push({
        date: TODAY,
        todos: this.data.todos
      })
    }

    my.setStorageSync({
      key:'todos_history'
    }, todos_history);
  },

  onLoad: function () {
    var that = this;
    var todos_history = my.getStorageSync({
      key: 'todos_history'
    });
    var todos = [];

    for (var i = 0; i < todos_history.length; i++) {
      if (todos_history[i].date == TODAY) {
        todos = todos_history[i].todos;
      }
    }

    if (todos) {
      // app.getUserInfo(function(userInfo) {
      //   that.setData({
      //     userInfo,
      //     todos
      //   })
      //   that.save();
      // })
      app.getUserInfo((userInfo) => {
      console.warn(`==== ${JSON.stringify(userInfo)}`);
      // 更新数据
      this.setData({
        userInfo,
        todos
      })
      this.save();
    });
    }
  },

  handleInput: function(e) {
    this.setData({
      input: e.detail.value
    })
  },

  todoAdd: function () {
    var {
      todos,
      input
    } = this.data;
    console.log(this.data);
    var length = todos.length;
    if (!input || !input.trim()) {
      return 0;
    }
    var date = new Date();
    var time = formatTime(date);
    todos.push({
      index: length + 1,
      value: input,
      time: time,
      completed: false
    })
    this.setData({
      todos,
      input: ''
    })
    this.save();
  },

  todoChange: function(e) {
    var todos = this.data.todos, values = e.detail.value;
    for (var i = 0; i < todos.length; i++) {
        todos[i].completed = false;

        for (var j = 0; j < values.length; j++) {
            if (todos[i].index == values[j]) {
                todos[i].completed = true;
                break;
            }
        }
    }
    var allCompleted = this.data.allCompleted;
    if (todos.length === values.length) {
      allCompleted = false;
    } else if (values.length === 0) {
      allCompleted = true;
    } else {
      //do nothing
    }
    
    this.setData({
      todos,
      allCompleted
    })
    this.save();
  },

  handleAll: function() {
    var {
      todos,
      allCompleted
    } = this.data;
    for (var i = 0; i < todos.length; i++) {
        todos[i].completed = allCompleted
    }
    this.setData({
      todos,
      allCompleted: !allCompleted
    })
    this.save();
  },

  clearCompleted: function() {
    var that = this;

    var {
      todos,
    } = that.data;
    var remain = todos.filter(function(todo) {
      return todo.completed === false;
    });

    if (remain.length < todos.length) {
      my.confirm({
        title: '提示',
        content: '清空已完成的Todos？',
        success: function(res) {
          if (res.confirm) {

            that.setData({
              todos: remain
            })
            that.save();
          }
        }
      });
    }
  }
})
