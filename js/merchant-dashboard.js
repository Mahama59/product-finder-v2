// ======================================
// PRODUCT FINDER - MERCHANT DASHBOARD JS
// ======================================

console.log("merchant-dashboard.js loaded");


// GET TOKEN
function getMerchantToken(){

    return localStorage.getItem("token");

}


// LOAD MERCHANT DASHBOARD

async function loadMerchantDashboard(){

    const token = getMerchantToken();


    if(!token){

        alert("Please login as merchant");

        window.location.href =
        "merchant-login.html";

        return;

    }


    try{

        const response =
        await fetch(
            "https://turbo-space-palm-tree-5jp65476vqg2rq7-3000.app.github.dev/api/dashboard/merchant",
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


        if(!data.success){

            alert(data.message);

            return;

        }


        const dashboard =
        data.dashboard;


        document.getElementById(
            "productCount"
        ).innerText =
        dashboard.totalProducts || 0;


        document.getElementById(
            "approvedProducts"
        ).innerText =
        dashboard.totalProducts || 0;


        document.getElementById(
            "pendingProducts"
        ).innerText =
        0;



        const products =
        dashboard.recentProducts || [];


        const container =
        document.getElementById(
            "merchantProducts"
        );


        container.innerHTML="";


        products.forEach(product=>{


            container.innerHTML += `

            <div class="card">

            <h3>
            ${product.name}
            </h3>

            <p>
            Category:
            ${product.category}
            </p>


            <p>
            Price:
            GHS ${product.price}
            </p>


            <p>
            Stock:
            ${product.stock}
            </p>


            </div>

            `;


        });



    }
    catch(error){

        console.error(
            "Dashboard error:",
            error
        );

    }

}



// LOAD ANALYTICS PLACEHOLDER

function loadMerchantAnalytics(){

    console.log(
        "Analytics loaded"
    );

}



// SALES CHART

function loadSalesChart(){

    const canvas =
    document.getElementById(
        "salesChart"
    );


    if(!canvas){

        return;

    }


    new Chart(
        canvas,
        {

        type:"bar",

        data:{

            labels:[
                "Jan",
                "Feb",
                "Mar",
                "Apr"
            ],

            datasets:[{

                label:
                "Sales",

                data:[
                    0,
                    0,
                    0,
                    0
                ]

            }]

        }


    });


}



// BEST PRODUCTS

function loadBestProducts(){

    const box =
    document.getElementById(
        "bestProducts"
    );


    if(box){

        box.innerHTML =

        "<p>No sales data yet</p>";

    }

}



// MESSAGE COUNT

function updateMerchantMessageCount(){

    const badge =
    document.getElementById(
        "messageCount"
    );


    if(badge){

        badge.innerText = 0;

    }

}
