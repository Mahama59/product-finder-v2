console.log("merchant-products.js loaded");


function merchantToken(){

    return localStorage.getItem("token");

}



// LOAD PRODUCTS

async function loadMerchantProducts(){

    const token = merchantToken();


    if(!token){

        window.location.href =
        "merchant-login.html";

        return;

    }


    try{


        const response =
        await fetch(
            "https://turbo-space-palm-tree-5jp65476vqg2rq7-3000.app.github.dev/api/merchant/products",
            {

                headers:{

                    Authorization:
                    "Bearer " + token

                }

            }
        );


        const data =
        await response.json();


        console.log(data);


        const container =
        document.getElementById(
            "productsList"
        );


        container.innerHTML="";


        data.products.forEach(product=>{


            container.innerHTML += `

            <div class="card">

            <h3>
            ${product.name}
            </h3>


            <p>
            Price:
            GHS ${product.price}
            </p>


            <p>
            Stock:
            ${product.stock}
            </p>


            <button onclick="
            editMerchantProduct('${product.id}')
            ">
            ✏️ Edit
            </button>


            <button onclick="
            deleteMerchantProduct('${product.id}')
            ">
            🗑 Delete
            </button>


            </div>

            `;


        });



    }
    catch(error){

        console.error(error);

    }

}



// DELETE PRODUCT

async function deleteMerchantProduct(id){


    const token =
    merchantToken();


    if(!confirm(
        "Delete this product?"
    )) return;



    await fetch(

        "https://turbo-space-palm-tree-5jp65476vqg2rq7-3000.app.github.dev/api/products/"
        + id,

        {

            method:"DELETE",

            headers:{

                Authorization:
                "Bearer " + token

            }

        }

    );


    alert(
        "Product deleted"
    );


    loadMerchantProducts();


}



// EDIT PAGE

function editMerchantProduct(id){

    localStorage.setItem(
        "editProductId",
        id
    );


    window.location.href =
    "merchant-edit-product.html";

}
