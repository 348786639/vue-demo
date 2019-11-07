import request from '../../utils/request';
export const getRoleData = (query) => {
    return request({
        url: '/system/role.do',
        method: 'post',
        data: query
    })
}

export const saveOrUpdateRole = (form) => {
    return request({
        url: '/system/saveOrUpdateRole.do',
        method: 'post',
        data: form
    })
}

export const getRoleDataByResourceId = (query) => {
    return request({
        url: '/system/roleByResourceId.do',
        method: 'post',
        data: query
    })
}

/**
 * 配置角色的资源
 * @param {*} query 
 */
export const configResourceRole = (form) => {
    return request({
        url: '/system/configResourceRole.do',
        method: 'post',
        data: form
    })
}

//查询用户（部门分组） 和选中的用户
export const initEmployee = (form) => {
    return request({
        url: '/system/userByRoleId.do',
        method: 'post',
        data: form
    })
}

//保存角色关联的用户
export const saveRoleUser = (form) => {
    return request({
        url: '/system/saveRoleUser.do',
        method: 'post',
        data: form
    })
}
