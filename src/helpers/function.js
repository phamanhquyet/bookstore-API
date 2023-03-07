//hàm xử lý code sách dựa trên value của nó
//trả về một code unique
export const generateCode = (value) => {
    //sẽ có thể phát sinh trường hợp sách là tên tiếng Việt, nên cần xóa dấu đi
    let output = '';
    //normalize giúp chuẩn hóa về dạng không có dấu câu
    value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(' ').forEach(item => {
    //split giúp chém value ra thành mảng, lấy dấu cách làm mốc
    //ví dụ: xin chào Việt Nam
    //split(' ') => ['xin', 'chào', 'Việt', 'Nam']
        output += item.charAt(1) + item.charAt(0)
        //lấy kí tự thứ 2 + kí tự đầu 
    });
    return output.toUpperCase() + value.length
}

//ví dụ: xin chào việt nam 
// -> IXHCIVAN17
