const Product = require('../models/ProductModel');

//[POST] /create
const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const { name } = newProduct;
    try {
      const checkProduct = await Product.findOne({ name: name });
      if (checkProduct !== null) {
        resolve({
          status: 'OK',
          message: 'The name is already',
        });
      }
      const createdProduct = await Product.create(newProduct);
      if (createdProduct) {
        resolve({
          status: 'OK',
          message: 'Success',
          data: createdProduct,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

//[PUT] /update/:id
const updateProduct = (productId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findById(productId);
      if (checkProduct === null) {
        //check product is existing
        resolve({
          status: 'OK',
          message: 'The product is not exist',
        });
      }
      const productUpdated = await Product.findByIdAndUpdate(productId, data, { new: true });
      resolve({
        //OK? => return data
        status: 'OK',
        message: 'Success',
        data: productUpdated,
      });
    } catch (error) {
      reject(error);
    }
  });
};

//[DELETE] /delete/:id
const deleteProduct = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findById(productId);
      if (checkProduct === null) {
        //check product is existing
        resolve({
          status: 'OK',
          message: 'The product is not exist',
        });
      }
      await Product.findByIdAndDelete({ _id: productId });
      resolve({
        //OK? => return data
        status: 'OK',
        message: 'Delete success',
      });
    } catch (error) {
      reject(error);
    }
  });
};

//[DELETE] /delete-many
const deleteManyProduct = (productIds) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.find({ _id: productIds });
      if (checkProduct.length === 0) {
        //check product is existing
        resolve({
          status: 'OK',
          message: 'The product is not exist',
        });
      }
      await Product.deleteMany({ _id: { $in: productIds } });
      resolve({
        //OK? => return data
        status: 'OK',
        message: 'Delete success',
      });
    } catch (error) {
      reject(error);
    }
  });
};

//[GET] /get-all
const getAllProducts = (queryData) => {
  const {
    sort_field = 'name',
    sort_type = 'asc',
    search_field = 'name',
    search,
    pageCurrent = 1,
    pageSize = 3,
  } = queryData;
  // Tìm kiếm không phân biệt chữ hoa/chữ thường với $regex và tùy chọn 'i'
  const regex = new RegExp(search, 'i');

  return new Promise(async (resolve, reject) => {
    try {
      if (search_field && search) {
        Promise.all([
          Product.find({ [search_field]: { $regex: regex } })
            .sort({ [sort_field]: ['asc', 'desc'].includes(sort_type) ? sort_type : 'desc' })
            .skip((pageCurrent - 1) * pageSize)
            .limit(pageSize),
          Product.countDocuments({ [search_field]: { $regex: regex } }),
        ])
          .then(([productAlls, totalProducts]) => {
            resolve({
              //OK? => return data
              status: 'OK',
              message: 'Get products is success',
              totalProducts,
              totalPages: Math.ceil(totalProducts / pageSize),
              pageCurrent,
              data: productAlls,
            });
          })
          .catch((err) => {
            return res.status(404).json({
              status: 'ERR',
              message: 'Error',
            });
          });
      } else {
        Promise.all([
          Product.find({})
            .sort({ [sort_field]: ['asc', 'desc'].includes(sort_type) ? sort_type : 'desc' })
            .skip((page - 1) * pageSize)
            .limit(pageSize),
          Product.countDocuments({}),
        ])
          .then(([productAlls, totalProducts]) => {
            resolve({
              //OK? => return data
              status: 'OK',
              message: 'Get products is success',
              totalProducts,
              totalPages: Math.ceil(totalProducts / pageSize),
              data: productAlls,
            });
          })
          .catch((err) => {
            return res.status(404).json({
              status: 'ERR',
              message: 'Error',
            });
          });
      }
    } catch (error) {
      reject(error);
    }
  });
};

//[GET] /filter
const filterProducts = (queryData) => {
  // const {
  //   sort_field = 'name',
  //   sort_type = 'asc',
  //   search_fields = [], // Khởi tạo một mảng rỗng để lưu các cặp trường tìm kiếm
  //   pageCurrent = 1,
  //   pageSize = 3,
  // } = queryData;

  // const searchConditions = [];

  // // Xử lý mỗi cặp trường và giá trị tìm kiếm tương ứng
  // for (let i = 0; i < search_fields.length; i += 2) {
  //   const searchField = search_fields[i];
  //   const searchValue = search_fields[i + 1];
  //   const condition = { [searchField]: { $regex: new RegExp(searchValue, 'i') } };
  //   searchConditions.push(condition);
  // }

  // return new Promise(async (resolve, reject) => {
  //   try {
  //     Promise.all([
  //       Product.find({ $and: searchConditions }) // Sử dụng $and để đảm bảo tất cả các điều kiện đều phải đúng
  //         .sort({ [sort_field]: ['asc', 'desc'].includes(sort_type) ? sort_type : 'desc' })
  //         .skip((pageCurrent - 1) * pageSize)
  //         .limit(pageSize),
  //       Product.countDocuments({ $and: searchConditions }),
  //     ])
  //       .then(([productAlls, totalProducts]) => {
  //         resolve({
  //           status: 'OK',
  //           message: 'Get products is success',
  //           totalProducts,
  //           totalPages: Math.ceil(totalProducts / pageSize),
  //           pageCurrent,
  //           data: productAlls,
  //         });
  //       })
  //       .catch((err) => {
  //         return res.status(404).json({
  //           status: 'ERR',
  //           message: 'Error',
  //         });
  //       });
  //   } catch (error) {
  //     reject(error);
  //   }
  // });
};

//[GET] /get-detail
const getDetailProduct = (productName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({ name: productName });
      if (product === null) {
        resolve({
          status: 'ERR',
          message: 'Product is not exist',
        });
      }
      resolve({
        //OK? => return data
        status: 'OK',
        message: 'Get product is success',
        data: product,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  deleteManyProduct,
  getAllProducts,
  filterProducts,
  getDetailProduct,
};
