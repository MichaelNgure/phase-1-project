document.addEventListener('DOMContentLoaded', ()=>{
    // Selecting Dom Elements
    const inputsDiv = document.getElementById('inputs')
    const outputsDiv = document.getElementById('outputs')
    const cardNumberInput = document.getElementById('cardNumber')
    const submitButton = document.getElementById('submit')
    const customerForm = document.getElementById('customerForm')
    const nameInput = document.getElementById('customerName')
    const idNumberInput = document.getElementById('idNumber')
    const cardNumber2Input = document.getElementById('cardNumber2')
    const priceInput = document.getElementById('priceInput')
    const pointsButton = document.getElementById('pointsButton')
    const deleteButton = document.getElementById('deleteCustomer')

    // Keyup event which changes the letters of word keyed in to upper case
    nameInput.addEventListener('keyup', uppercase)
    function uppercase(){
        let x = nameInput
        x.value = x.value.toUpperCase()
        
    }

    // Keydown 
    function creatergb(){
        let number = Math.round(Math.random()*255 + 1)
        return number
    }
    cardNumberInput.addEventListener('keydown', colors)
    function colors(){
        cardNumberInput.style.backgroundColor =  `rgb(${creatergb()}, ${creatergb()}, ${creatergb()})`
    }
    const viewDiv = document.createElement('div')
    const pointsDiv = document.createElement('div')
    const deleteDiv = document.createElement('div')
    const addUserDiv = document.createElement('div')

    const url = 'http://localhost:3000/customers'

    // Viewing customer details when he eneters the card number
    const fetchData2 = async () => {
        const response = await fetch(url)
        const customers = await response.json()
        localStorage.setItem('customers', JSON.stringify(customers))

        submitButton.addEventListener('click', great)
        function great(){
            for(let element of customers){
                console.log(element.cardNumber)
                if(Number(cardNumberInput.value) === element.cardNumber){
                    viewDiv.innerHTML = `
                    <h3> Account Details </h3>
                    <p> Name: <b> ${element.name} </b> </P>
                    <p> Id Number: <b> ${element.idNumber} </b> </P>
                    <p> Points: <b> ${element.points} </b> </P>
                    <hr>
                    `
                    break
                }else{
                    viewDiv.innerHTML = `
                    <p id= 'errorParagraph' > Card Number <b>${cardNumberInput.value}</b> Not Found! <p>
                    <hr>
                `
            
                }
            }
            outputsDiv.append(viewDiv)
        }
        
        // Updating customer points after he or she has put the price of goods bought
        pointsButton.addEventListener('click', pointsAwarded)
        function pointsAwarded(){
            const price = Number(priceInput.value)
            const pointsEarned = Math.floor(price / 100)
            for (let customer of customers){
                if (customer.cardNumber === Number(cardNumber2Input.value)) {
                
                    pointsDiv.innerHTML = `
                    <h3> Points System </h3>
                    <p> Op.Bal: <b> ${customer.points} </b> </p>
                    <p> Pnts Awarded: <b> ${pointsEarned} </b> </p>
                    <p> Cl.Bal: <b> ${customer.points + pointsEarned} </b> </p>
                    <hr>
                    `
                    const points = customer.points + pointsEarned 
                    function updatePoints(){
                        fetch(`${url}/${customer.id}`, {
                            method: "PATCH",
                            headers:{
                                "Content-Type" : "application/json"
                            },
                            body: JSON.stringify({points: points})
                        })
                    }
                    updatePoints()
                    fetchData2()
                    break
                }else if (customer.cardNumber !== Number(cardNumber2Input.value)){
                    pointsDiv.innerHTML = `
                    <p id= 'errorParagraph' > Card Number <b>${cardNumber2Input.value}</b> Not Found! <p>
                    <hr>
                    ` 
                }
            }
             outputsDiv.append(pointsDiv)
        }

        // Deleting user account details

        deleteButton.addEventListener('click', async ()=>{
            for(const customer of customers){
                if(customer.cardNumber === Number(cardNumberInput.value)){
                    deleteDiv.innerHTML = `
                    <p id='errorParagraph' > The account of <b>${customer.name}</b> has been deleted! </p>
                    <hr>
                    `
                    await fetch(`${url}/${customer.id}`,{
                        method: 'DELETE'
                    })
                }
            }
            outputsDiv.append(deleteDiv)

        })
          
        

    }
    fetchData2()

    // add user
    function randomNumber(){
        const number = Math.floor(Math.random()*10000)
        return number
    }
    customerForm.addEventListener('submit', async(e)=>{
        e.preventDefault()
        // const id = document.getElementById('customerId').value
        const name = document.getElementById('customerName').value
        const idNumber = document.getElementById('idNumber').value
        const cardNumber = randomNumber()
        const points = 0

        const response = await fetch(url)
        const customers = await response.json()
        const maxId = customers.length > 0 ? Math.max(...customers.map(user => user.id))  : 0;
        const newId = maxId  + 1 

        await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({id: newId.toString(), name, idNumber, cardNumber, points})
        })
        fetchData2()
        addUserDiv.innerHTML = `
        <p> Your card number is: <b> ${cardNumber} </b> </p>
        <hr>
        `
        nameInput.value = ''
        idNumberInput.value = ''
        outputsDiv.append(addUserDiv)
    })
    
})


