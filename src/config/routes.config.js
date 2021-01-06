import AsyncCompnent from "../utils/AsyncComponent";

const StudentInfo = AsyncCompnent(() => import('../pages/student/student-info'));

const EvaluationAllResult = AsyncCompnent(() => import('../pages/evaluation/evaluation-all-result'));
const EvaluationAllSchedule = AsyncCompnent(() => import('../pages/evaluation/evaluation-all-schedule'));
const EvaluationPartFinished = AsyncCompnent(() => import('../pages/evaluation/evaluation-part-finished'));
const EvaluationPartOngoing = AsyncCompnent(() => import('../pages/evaluation/evaluation-part-ongoing'));
const EvaluationPartWaiting = AsyncCompnent(() => import('../pages/evaluation/evaluation-part-waiting'));

const Account = AsyncCompnent(() => import('../pages/account'));

// 角色id：辅导员-1，学工部-2，超级管理员-3

const ROUTES = [
  {
    key: 'student',
    text: '学生管理',
    role: '123',
    childs: [
      {
        key: 'student-info',
        path: '/student/info',
        text: '全部学生信息',
        role: '123',
        component: StudentInfo,
      },
    ]
  },
  {
    key: 'evaluation',
    text: '互评管理',
    role: '123',
    childs: [
      {
        key: 'evaluation-all-schedule',
        path: '/evaluation/all/schedule',
        text: '互评时间管理',
        role: '23',
        component: EvaluationAllSchedule,
      },
      {
        key: 'evaluation-all-result',
        path: '/evaluation/all/result',
        text: '互评结果管理',
        role: '23',
        component: EvaluationAllResult,
      },
      {
        key: 'evaluation-part-waiting',
        path: '/evaluation/part/waiting',
        text: '未开始的互评',
        role: '1',
        component: EvaluationPartWaiting,
      },
      {
        key: 'evaluation-part-ongoing',
        path: '/evaluation/part/ongoing',
        text: '进行中的互评',
        role: '1',
        component: EvaluationPartOngoing,
      },
      {
        key: 'evaluation-part-finished',
        path: '/evaluation/part/finished',
        text: '已结束的互评',
        role: '1',
        component: EvaluationPartFinished,
      },
    ]
  },
  {
    key: 'account',
    text: '账号管理',
    role: '23',
    childs: [
      {
        key: 'account',
        path: '/account',
        text: '管理辅导员账号',
        role: '23',
        component: Account,
      },
    ]
  }
]

export { ROUTES };
