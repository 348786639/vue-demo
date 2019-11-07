import request from '../../utils/request';

export const getResourceTree = () => {
    return request({
        url: '/sysResource/tree.do',
        method: 'post',
    })
}

export const saveOrUpdateResource = (form) => {
    return request({
        url: '/sysResource/saveOrUpdateResource.do',
        method: 'post',
        data: form
    })
}

export const initTree = (form) => {
    return request({
        url: '/sysResource/initTree.do',
        method: 'post',
        data: form
    })
}

/**
 * 侧边栏
 */
export const getSidebarTree = () => {
    return request({
        url: '/sysResource/sidebarMenu.do',
        method: 'post',
    })
}