import qs from 'query-string';
import request from './request';

const pagination = {
    LIMIT: 50,
    UNLIMITED: -1,
    PAGINATION: {
        offset: 0,
        limit: 50,
    },
};

const PROMOTIONS_URL = 'promotions';

export const getPromotions = (offset) => {
    return request.get(`${PROMOTIONS_URL}?${qs.stringify({
        limit: pagination.LIMIT,
        offset,
    })}`);
};

export const getPromotion = id => request.get(`${PROMOTIONS_URL}/${id}`);

export const createNewPromotion = (promotion) => {
    return request.post({ url: PROMOTIONS_URL, data: { promotion }, });
};

export const generatePromotions = (lastId, size) => {
    return request.post({ url: `${PROMOTIONS_URL}/generateJson`, data: { lastId, size} });
};

export const updatePromotion = (id, promotion) => 
    request.patch({ url: `${PROMOTIONS_URL}/${id}`, data: { promotion } });

export const deletePromotion = id => 
    request.delete({ url: `${PROMOTIONS_URL}/${id}`});