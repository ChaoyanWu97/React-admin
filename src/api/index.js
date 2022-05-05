/**
 * 包含应用中所有接口请求函数的模块
 */
import { message } from 'antd';
import jsonp from 'jsonp';
import ajax from './ajax';

// const BASE = 'http://localhost:5000';
const BASE = '';

/**
 * 登录接口
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise}
 */
export const reqLogin = (username, password) => 
     ajax(BASE+'/login', {username, password}, 'POST')

/**
 * 添加用户
 * @param {Object} user 
 * @param {string} user.username
 * @param {string} user.password
 * @param {string} [user.phone]
 * @param {string} [user.email]
 * @param {string} [user.role_id]
 * @returns {Promise}
 */
export const reqAddUser = (user) => 
    ajax(BASE+'/manage/user/add', user, 'POST');

/**
* 天气查询
* @param {string} citycode 
* @returns {Promise}
*/
export const reqWeather = (citycode='110101') => {
     return new Promise((resolve, _) => {
          const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=110101&key=0b389e3ae69597e24385a2d9074852de`;
          // 发送jsonp请求
          jsonp(url, {}, (err, data) => {
               if (!err && data.info === 'OK' && data.lives[0].city){
                    const {weather} = data.lives[0];
                    resolve(weather)
               } else{
                    message.error('获取天气信息失败！')
               }
          })
     })
}

//=====================分类列表相关,相关接口不好用了,先手动生成了一些数据，学习mongodb之后再修改==========================
/*
const rawData_Category = [
     {category: '零食速食', subCtgry:[
         {category: '豆干肉干'},
         {category: '方便面'},
         {category: '曲奇饼干'},
     ]},
     {category: '粮油调味', subCtgry:[
         {category: '调味酱'},
         {category: '面粉烘培'},
         {category: '食用油'},
     ]},
     {category: '乳饮酒水', subCtgry:[
         {category: '牛奶'},
         {category: '饮用水'},
         {category: '茶叶'},
     ]},
 ];

 const mapToFormateDate = (goods,  parentId=0) => {
     return goods.map((item, index) => {
         const category = {};
         category._id = parentId === 0 ? (index+1).toString() : parentId+'_'+(index+1).toString();
         category.parentId = parentId+'';
         category.name = item.category;
         if (item.subCtgry){
             category.sub = mapToFormateDate(item.subCtgry, category._id)
         }
         return category;
     })
 };

const getCategories = (parentId) => {
     if (parentId === '0') return categories;
     categories[parentId - 1].sub = categories[parentId - 1].sub || []
     return  categories[parentId - 1].sub;
 };

const addCategory = (parentId, categoryName) => {
     if (parentId === '0') { 
          const len = categories.length;
          const item = {
          _id : len + 1 + '',
          parentId,
          name: categoryName,
          }
          categories.push(item)
     } else {
          const curCategories = categories[parentId - 1].sub;        
          const len = curCategories.length;
          const item = {
            _id : `${parentId}_${len+1}`,
            parentId,
            name: categoryName,
          }
          categories[parentId - 1].sub.push(item)
     }
     console.log(categories);
     return categories;
}

const updateCategory = (categoryId, categoryName) => {
     const findId = (categoryId, categories) => {
         for (const category of categories) {
             if (category._id === categoryId) {
                 category.name = categoryName;
                 return;
             } else if (category.sub) {
                 findId(categoryId, category.sub);
             }
         }
         return;
     }
     findId(categoryId, categories);
     return categories;
 }

const categories = mapToFormateDate(rawData_Category);
*/

/**
 * 获取一级或某个二级分类列表
 * @param {string} parentId GET请求参数值, 父级分类的ID
 * @returns {Promise}
 */
export const reqCategory = (parentId) => 
     ajax(BASE + '/manage/category/list', {parentId});
// export const reqCategory = (parentId) => {
//     const categories = getCategories(parentId);
//     return {status:0, data:JSON.parse(JSON.stringify(categories))};
// }


/**
 * 添加分类
 * @param {string} parentId 父级分类的ID
 * @param {string} categoryName 名称
 * @returns {Promise}
 */
export const reqAddCategory = (parentId, categoryName) => 
     ajax(BASE + '/manage/category/add', {parentId, categoryName}, "POST");
// export const reqAddCategory = (parentId, categoryName) => {
//     const categories = addCategory(parentId, categoryName);
//     return {
//      "status": 0,
//      "data":categories,
//     }
// }


/**
 * 
 * @param {string} categoryId 父级分类的ID
 * @param {string} categoryName 名称
 * @returns {Promise}
 */
export const reqUpdateCategory = (categoryId, categoryName) => 
     ajax(BASE + '/manage/category/update', {categoryId, categoryName}, "POST");
// export const reqUpdateCategory = (categoryId, categoryName) => {
//      const categories = updateCategory(categoryId, categoryName);
//      return {
//           "status": 0,
//           "data": categories,
//      }
// }

export const reqOneCategory = (categoryId) => 
    ajax(BASE + '/manage/category/info', {categoryId})




/**===================================商品管理相关========================================
 * 后台分页：获取第pageNum页的分页列表，每页显示pageSize条数
 * @param {number} pageNum 
 * @param {number} pageSize 
 * @returns {Promise}
 */
export const reqProducts = (pageNum, pageSize) => 
    ajax(BASE + '/manage/product/list', {pageNum, pageSize});

/**
 * 
 * @param {object} param - GET请求的参数对象
 * @param {number} param.pageNum
 * @param {number} param.pageSize
 * @param {string 'searchName' || 'searchNameDesc'} param.seatchType - 指定按名称/描述搜索
 * @param {string} param.searchName 
 * @returns 
 */
export const reqSearchProducts = ({pageNum, pageSize, searchType, searchName}) => 
    ajax(BASE + '/manage/product/search', {
        pageNum,
        pageSize,
        [searchType]: searchName,
    });

/**
 * 对商品进行上架/下架处理
 * @param {string} productId - 商品id
 * @param {number 1|2} status - 商品状态值 1:在售 2:下架
 * @returns 
 */
export const reqSwitchProductStatus = (productId, status) => 
    ajax(BASE + '/manage/product/updateStatus', { productId, status }, 'POST');

/**
 * 删除图片
 * @param {string} name - 图片文件名
 * @returns 
 */
export const reqDeleteImg = (name) => 
    ajax(BASE + '/manage/img/delete', {name}, "POST")


/**
 * 添加/修改商品
 * @param {object} product 
 * @returns 
 */
export const reqAddOrUpdateProduct = (product) => {
    const reqType = product._id ? 'update' : 'add';
    return ajax(BASE + `/manage/product/${reqType}`, product, 'POST')
}

    


