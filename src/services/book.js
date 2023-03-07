import db from '../models';
import { Op } from 'sequelize';
import { v4 as generateId} from 'uuid'
const cloudinary = require('cloudinary').v2;

//CRUD = CREATE - READ - UPDATE - DELETE

//READ
export const getBooks = ({ page, limit, order, name, available, ...query }) =>
  new Promise(async (resolve, reject) => {
    //limit: mỗi lần lấy bao nhiêu
    //page, limit, order không phải để filter mà là để phân trang, nên dùng queries
    //name hay các biến khác (nếu có) cần filter nên dùng query
    try {
      //tạo 1 object là queries để thiết lập việc truy vấn cho sequelize
      //xuyên suốt quá trình thì object sẽ được thêm thắt các cặp key/value để phục vụ việc truy vấn được chính xác như yêu cầu
      const queries = { raw: true, nest: true };
      //offset: vị trí mà mình muốn lấy, ví dụ offset = 10 thì sẽ lấy từ 10 trở đi và bỏ qua 9 cái trước
      const offset = !page || +page <= 1 ? 0 : +page - 1;
      const fLimit = +limit || +process.env.LIMIT_BOOK; //nếu truyền vào limit thì lấy, còn nếu không thì lấy limit trong file .env
      queries.offset = offset * fLimit;
      queries.limit = fLimit;
      if (order) queries.order = [order];
      if (name) query.title = { [Op.substring]: name }; //op là viết tắt của operator
      if (available) query.available = { [Op.between]: available };
      const response = await db.Book.findAndCountAll({ 
        where: query,
        ...queries, //sử dụng destructuring rải các thuộc tính của queries ra
        attributes: {
          exclude: ['category_code', 'description'],
        },
        //Nếu đứng từ bảng book mà chỉ cần chọc tới 1 bảng nữa thôi thì ko cần truyền mảng, truyền object là được
        //Còn nếu muốn lấy từ 2 bảng trở lên thì phải để vào một cái mảng, trong mảng sẽ chứa các object tương ứng với từng bảng muốn lấy.
        //có thể viết bọc trong mảng như bên dưới
        include: [
          {
            model: db.Category,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            as: 'categoryData',
          },
        ],
      });
      resolve({
        error: response ? 0 : 1,
        message: response ? 'Got' : 'Cannot found',
        bookData: response,
      });
    } catch (error) {
      reject(error);
    }
  });

//CREATE
export const createNewBook = (body, fileData) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Book.findOrCreate({
        where: { title: body?.title },
        //default (số ít): tạo 1 cột theo key/value đầu tiên trong object
        //defaults (số nhiều): tạo nhiều cột theo số cặp key/value trong object
        defaults: {
          ...body,
          id: generateId(),
          image: fileData?.path
        }
      });
      resolve({
        error: response[1] ? 0 : 1, //true: 0 false: 1
        message: response[1] ? 'Created' : 'Cannot create new book',
      });
      if(fileData && !response[1]) cloudinary.uploader.destroy(fileData.filename);
    } catch (error) {
      //nếu việc thêm sách bị lỗi thì phải xóa ảnh trên cloudinary vì khi chạy nó sẽ chạy vào middleware để up ảnh lên trước
      reject(error);
      if(fileData) cloudinary.uploader.destroy(fileData.filename);
    }
  });

  

//UPDATE
export const updateBook = ({bid, ...body}, fileData) =>
  new Promise(async (resolve, reject) => {
    try {
      if(fileData) body.image = fileData?.path
      const response = await db.Book.update(
        body,
        {
          where: { id: bid } 
        }
      );
      resolve({
        error: response[0] > 0 ? 0 : 1, //true: 0 false: 1
        message: response[0] ? `${response[0]} updated` : 'Cannot update',
        
      });
      if(fileData && !response[0] === 0) cloudinary.uploader.destroy(fileData.filename);
    } catch (error) {
      reject(error);
      if(fileData) cloudinary.uploader.destroy(fileData.filename);
    }
  });