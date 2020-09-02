import React, {useState} from "react"
import Base from "../core/Base"
import {isAuthenticated} from "../auth/helper/index"
import {Link} from "react-router-dom"
import {createCategory} from "./helper/adminapicall"
function AddCategory() {
  const [name, setName] = useState("")
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  const {user, token} = isAuthenticated()

  const goBack = () => (
    <div className="mt-5">
      <Link className="btn btn-sm btn-info mb-3" to="/admin/dashboard">
        Admin Home
      </Link>
    </div>
  )

  const handleChange = (e) => {
    setError("")
    setName(e.target.value)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    setError("")
    createCategory(user._id, token, {name}).then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setError(false)
        setSuccess(true)
        setName("")
      }
    })
  }

  const SuccessMessage = () => {
    if (success) {
      return <h4 className="text-success">Category Created Successfully</h4>
    }
  }

  const warningMessage = () => {
    if (error) {
      return <h4 className="text-danger">Failed to Create Category</h4>
    }
  }

  const myCategoryForm = () => {
    return (
      <form>
        <div className="form-group">
          <p className="lead">Enter the Category</p>
          <input
            type="text"
            className="form-control my-3"
            onChange={handleChange}
            value={name}
            autoFocus
            required
            placeholder="for EX summer"
          />
          <buton onClick={onSubmit} className="btn btn-outline-info">
            Create Category
          </buton>
        </div>
      </form>
    )
  }

  return (
    <Base
      title="Create a category here"
      description="Add a new product"
      className="container bg-into p-4"
    >
      <div className="row bg-white rounded">
        <div className="col-md-8 offset-md-2">
          {SuccessMessage()}
          {warningMessage()}
          {myCategoryForm()}
          {goBack()}
        </div>
      </div>
    </Base>
  )
}

export default AddCategory
