import db from '../models';
import data from '../../data/data.json'
import { generateCode } from '../helpers/function';

export const insertData = () => new Promise(async (resolve, reject) => {
    try {
        const categories = Object.keys(data)
        categories.forEach(async (item) => {
            await db.Category.create({
                code: generateCode(item),
                value: item
            })
        })    
        //đoạn này là lấy một đoạn data từ json để nạp lên database
        const dataArr = Object.entries(data)
        //item là một mảng, có dạng [key, [thông tin của những quyển sách]]
        dataArr.forEach((item) => {
            //?. Nếu đúng: Trả về kết quả, nếu sai, trả về undefined 
            item[1]?.map(async(book) => {
                await db.Book.create({
                    id: book.upc,
                    title: book.bookTitle,
                    //để dấu + ở phía trước để convert ra kiểu số
                    price: +book.bookPrice,
                    available: +book.available,
                    image: book.imageUrl,
                    description: book.bookDescription,
                    category_code: generateCode(item[0])

                })
            })
        })
        resolve('ok')
    } catch (error) {
        console.log(error);
        reject(error)
    }
})