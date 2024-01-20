const { REACT_APP_API_URL } = process.env;

const BaseURL = REACT_APP_API_URL;

module.exports = {
   BaseURL
}

// const GetDataUser = async () => {
//    const dataUser = JSON.parse(localStorage.getItem("user"));

//    console.log("LOG-data", dataUser)
//    await axios.get(`${BaseURL}/user`, { 
//       headers: { 
//          "Authorization": `Bearer ${localStorage.getItem("accessToken")}` 
//       } 
//    }).then(res => { 
//       console.log("LOG-res", res) 
//       localStorage.setItem("user", JSON.stringify(res?.data?.data)); 
//    }).catch(err => { 
//       console.log("LOG-err", err) 
//    })
// }