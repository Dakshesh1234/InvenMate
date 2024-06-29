"use client"
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { useState, useEffect } from 'react'


export default function Home() {
  const [productForm, setProductForm] = useState({})
  const [products, setProducts] = useState([])
  const [alert, setAlert] = useState("")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingaction, setLoadingaction] = useState(false)
  const [dropdown, setDropdown] = useState([])


  useEffect(() => {
    // Fetch products on load 
    const fetchProducts = async () => {
      const response = await fetch('/api/product')
      let rjson = await response.json()
      setProducts(rjson.products)
    }
    fetchProducts()
  }, [])


  // const buttonAction = async (action, slug, initialQuantity) => {
  //   // Immediately change the quantity of the product with given slug in Products
  //   let index = products.findIndex((item) => item.slug == slug)
  //   let newProducts = JSON.parse(JSON.stringify(products))
  //   if (action == "plus") {
  //     newProducts[index].quantity = parseInt(initialQuantity) + 1
  //   }
  //   else {
  //     newProducts[index].quantity = parseInt(initialQuantity) - 1
  //   }
  //   setProducts(newProducts)

  //   // Immediately change the quantity of the product with given slug in Dropdown
  //   let indexdrop = dropdown.findIndex((item) => item.slug == slug)
  //   let newDropdown = JSON.parse(JSON.stringify(dropdown))
  //   if (action == "plus") {
  //     newDropdown[indexdrop].quantity = parseInt(initialQuantity) + 1
  //   }
  //   else {
  //     newDropdown[indexdrop].quantity = parseInt(initialQuantity) - 1
  //   }
  //   setDropdown(newDropdown)

  //   setLoadingaction(true)
  //   const response = await fetch('/api/action', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ action, slug, initialQuantity })
  //   });
  //   let r = await response.json()
  //   setLoadingaction(false)
  // }


  const addProduct = async (e) => {
    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productForm)
      });

      if (response.ok) {
        // Product added successfully
        setAlert("Your Product has been added!")
        setProductForm({})
      } else {
        // Handle error case
        console.error('Error adding product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    // Fetch all the products again to sync back
    const response = await fetch('/api/product')
    let rjson = await response.json()
    setProducts(rjson.products)
    e.preventDefault();
  }

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value })
  }

  const onDropdownEdit = async (e) => {
    let value = e.target.value
    setQuery(value)
    if (value.length > 2) {
      setLoading(true)
      setDropdown([])
      const response = await fetch('/api/search?query=' + query)
      let rjson = await response.json()
      setDropdown(rjson.products)
      setLoading(false)
    }
    else {
      setDropdown([])
    }
  }
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    console.log(id)
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/delete?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setAlert(data.message || "Your Product has been Deleted!");
        } else {
          const errorData = await response.json();
          setAlert(errorData.error || 'Error deleting product');
        }

        // Fetch all the products again to sync back
        const productsResponse = await fetch('/api/product');
        const rjson = await productsResponse.json();
        setProducts(rjson.products);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const deleteProductFromDropdown = async (id) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this product from Inventory?`);
    if (confirmDelete) {
      try {
        // Remove product from dropdown state
        let newDropdown = dropdown.filter(item => item._id !== id);
        setDropdown(newDropdown);

        // Delete product using existing deleteProduct function
        await deleteProduct(id);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  // New function to handle updates for quantity and price
  const handleDropdownChange = async (slug, field, value) => {
    const updatedDropdown = dropdown.map((item) => {
      if (item.slug === slug) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setDropdown(updatedDropdown);

    // Update the product in the backend
    const response = await fetch('/api/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ slug, field, value })
      
    });
    // Fetch all the products again to sync back
    const productsResponse = await fetch('/api/product');
    const rjson = await productsResponse.json();
    setProducts(rjson.products);

    const result = await response.json();
    if (!response.ok || !result.success) {
      console.error('Failed to update product');
    }
  };


  return (
    <div className='min-w-max'>
      <Header />
      <div className='p-20'>
        <div className="container mx-auto my-8">
          <div className='text-green-800 text-center'>{alert}</div>
          <h1 className="text-3xl font-semibold mb-6">Search a Product</h1>
          <div className="flex mb-2">
            <input onChange={onDropdownEdit} type="text" placeholder="Enter a product name" className="flex-1 border border-gray-300 px-4 py-2 rounded-l-md" />
            <select className="border border-gray-300 px-4 py-2 rounded-r-md">
              <option value="">All</option>
              <option value="category1">Category 1</option>
              <option value="category2">Category 2</option>
              {/* Add more options as needed */}
            </select>
          </div>
          {loading && <div className='flex justify-center items-center'> <img width={74} src="/loading.svg" alt="" /> </div>
          }
          <div className="dropcontainer absolute max-w-full border-1 bg-purple-100 rounded-md ">

            {dropdown.map(item => {
              return <div key={item.slug} className="container flex justify-between p-2 my-1 border-b-2 mx-auto">

                <span className="slug"> {item.slug} ({item.quantity} available for ₹{item.price})</span>
                <div className='mx-5'>
                  <span>Quantity:</span>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleDropdownChange(item.slug, 'quantity', e.target.value)}
                    className="border px-2 py-1 w-25 mx-1"
                    placeholder="Qty"
                  />
                  <span>Price:</span>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleDropdownChange(item.slug, 'price', e.target.value)}
                    className="border px-2 py-1 w-25 mx-1"
                    placeholder="Price"
                  />
                  {/* <button onClick={() => { buttonAction("minus", item.slug, item.quantity) }} disabled={loadingaction} className="subtract inline-block px-3 py-1 cursor-pointer bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200"> - </button> */}

                  {/* <span className="quantity inline-block  min-w-3 mx-3">{item.quantity}</span> */}
                  {/* <button onClick={() => { buttonAction("plus", item.slug, item.quantity) }} disabled={loadingaction} className="add inline-block px-3 py-1 cursor-pointer bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200">  + </button> */}
                  <button onClick={() => deleteProductFromDropdown(item._id)} className="ml-5 inline-block px-3 py-1 cursor-pointer bg-red-500 text-white font-semibold rounded-lg shadow-md">Delete</button>

                </div>
              </div>
            })}
          </div>
        </div>

        {/* Display Current Stock  */}
        <div className="container mx-auto my-8">
          <h1 className="text-3xl font-semibold mb-6">Add a Product</h1>

          <form>
            <div className="mb-4">
              <label htmlFor="productName" className="block mb-2">Product Slug</label>
              <input value={productForm?.slug || ""} name='slug' onChange={handleChange} type="text" id="productName" className="w-full border border-gray-300 px-4 py-2" />
            </div>

            <div className="mb-4">
              <label htmlFor="quantity" className="block mb-2">Quantity</label>
              <input value={productForm?.quantity || ""} name='quantity' onChange={handleChange} type="number" id="quantity" className="w-full border border-gray-300 px-4 py-2" />
            </div>

            <div className="mb-4">
              <label htmlFor="price" className="block mb-2">Price</label>
              <input value={productForm?.price || ""} name='price' onChange={handleChange} type="number" id="price" className="w-full border border-gray-300 px-4 py-2" />
            </div>

            <button onClick={addProduct} type="submit" className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md font-semibold">
              Add Product
            </button>


          </form>
        </div>
        <div className="container my-8 mx-auto">
          <h1 className="text-3xl font-semibold mb-6">Display Current Stock</h1>

          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Product Name</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                return <tr key={product.slug}>
                  <td className="border px-4 py-2">{product.slug}</td>
                  <td className="border px-4 py-2">{product.quantity}</td>
                  <td className="border px-4 py-2">₹{product.price}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              })}

            </tbody>
          </table>

        </div>
      </div>
      <Footer />
    </div>
  )
}
