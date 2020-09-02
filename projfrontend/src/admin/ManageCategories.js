import React, {useState, useEffect} from "react"
import Base from "../core/Base"
import {isAuthenticated} from "../auth/helper/index"
import {
  deleteCategory,
  updateCategory,
  getCategories,
} from "./helper/adminapicall"
import {Link} from "react-router-dom"

function ManageCategories() {
  const [categories, setCategories] = useState([])

  const { user,token} = isAuthenticated()

  const GetAllCategories = () => {
    getCategories()
      .then((data) => {
        console.log(data)
        if (data.err) {
          setCategories(data.err)
        } else {
          setCategories(data)
        }
      })
      .catch()
  }


  const DeleteCategory = (categoryId) => {
     deleteCategory(categoryId,user._id,token).then(data=>{
       if (data.err) {
         console.log(data.err)
       }else{
         GetAllCategories()
       }
     }).catch()
  }

  useEffect(() => {
    GetAllCategories()
  }, [])

  return (
    <Base
      title="Welcometo updateCategories"
      description="Manage categories here"
    >
      <h2 className="mb-4">All products:</h2>
      <Link className="btn btn-info" to={`/admin/dashboard`}>
        <span className="">Admin Home</span>
      </Link>
      <div className="row">
        <div className="col-12">
          <h2 className="text-center text-white my-3">
            Total {categories.length} products
          </h2>
          {categories.map((category, i) => {
            return(
            <div key={i}  className="row text-center mb-2 ">
              <div className="col-4">
                <h3 className="text-white text-left">{category.name}</h3>
              </div>
              <div className="col-4">
                <Link
                  className="btn btn-success"
                  to={`/admin/category/update/${category._id}`}
                >
                  <span className="">Update</span>
                </Link>
              </div>
              <div className="col-4">
                <button onClick={() => {DeleteCategory(category._id)}} className="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>

            )
          })}
        </div>
      </div>
    </Base>
  )
}

export default ManageCategories
