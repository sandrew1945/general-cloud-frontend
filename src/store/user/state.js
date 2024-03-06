import { getToken } from 'src/utils/auth'

export default function () {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    id: '',
    code: '',
    sex: '',
    roleId: '',
    roles: [],
    menuList: []
  }
}
