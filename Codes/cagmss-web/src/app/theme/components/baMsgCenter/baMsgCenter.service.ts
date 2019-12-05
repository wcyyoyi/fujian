import {Injectable} from '@angular/core'

@Injectable()
export class BaMsgCenterService {

  private _notifications = [
    {
      name: 'Vlad',
      text: '2017年01月13号福建省农业气象旬报已发布.',
      time: '1 min ago'
    },
    {
      name: 'Kostya',
      text: '2017年01月13号福建省农业气象周报已发布.',
      time: '2 hrs ago'
    },
    {
      image: 'assets/img/shopping-cart.svg',
      text: '2017年01月13号福建省农业气象月报已发布.',
      time: '5 hrs ago'
    },
    {
      name: 'Andrey',
      text: '降水产品自动任务已完成.',
      time: '1 day ago'
    },
    {
      name: 'Nasta',
      text: '日照产品自动任务已完成.',
      time: '2 days ago'
    },
    {
      image: 'assets/img/comments.svg',
      text: '气温产品自动任务已完成.',
      time: '3 days ago'
    },
    {
      name: 'Kostya',
      text: '灾害产品自动任务已完成.',
      time: '1 week ago'
    }
  ];

  private _messages = [
    {
      name: 'Nasta',
      text: '请制作下一月的月报...',
      time: '1 min ago'
    },
    {
      name: 'Vlad',
      text: '请制作下周的周报.',
      time: '2 hrs ago'
    },
    {
      name: 'Kostya',
      text: '请准时参加业务系统培训...',
      time: '10 hrs ago'
    },
    {
      name: 'Andrey',
      text: '新的农业气象产品已发布...',
      time: '1 day ago'
    },
    {
      name: 'Nasta',
      text: '提交年度计划...',
      time: '1 day ago'
    },
    {
      name: 'Kostya',
      text: '农业天气预报的产品制作情况...',
      time: '2 days ago'
    },
    {
      name: 'Vlad',
      text: '会议安排...',
      time: '1 week ago'
    }
  ];

  public getMessages():Array<Object> {
    return this._messages;
  }

  public getNotifications():Array<Object> {
    return this._notifications;
  }
}
