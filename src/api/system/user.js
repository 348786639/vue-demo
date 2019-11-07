import request from '../../utils/request';
export const getUserData = (query) => {
    return request({
        url: '/system/user.do',
        method: 'post',
        data: query
    })
}

export const getWorkPlace = () => {
    return request({
        url: '/dictionary/workPlace.do',
        method: 'get',
    })
}

export const saveOrUpdateUser = (form) => {
    return request({
        url: '/system/saveOrUpdateUser.do',
        method: 'post',
        data: form
    })
}



