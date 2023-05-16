const fileInput = document.getElementById("file-input");

const test = document.getElementById("testing")

fileInput.addEventListener("change", () => {
    const inputReader = new FileReader();

    //.files returns an array in case multiple files are uploaded, select first element since upload form is limited to one file at a time
    inputReader.readAsText(fileInput.files[0]);

    //Reading file takes time, will execute once file is loaded then convert JSON into a javascript object
    inputReader.addEventListener("load", () => {
        data = JSON.parse(inputReader.result);

        const iterate = (data) => {
            Object.keys(data).forEach(key => {
        
            console.log(`key: ${key}, value: ${data[key]}`)
        
            if (typeof data[key] === 'object' && data[key] !== null) {
                    iterate(data[key])
                }
            })
        }

        parseData(data);
    })
})


function parseData(data)
{
    //Grab tables to write to
    BII_Table = document.getElementById("BII_table");
    Deck_Table = document.getElementById("deck_table");

    let defects = data["subFields"][0].subFields

    //Manual parse for inspection date, bad practice but JSON structure is unpredictable
    document.getElementById("date_BII").textContent = data["subFields"][1]["subFields"][0]["subFields"][0]["name"];

    for (var i in defects)
    {
        console.log(defects[i].name);
        newRow = Deck_Table.insertRow(-1);
        
        let text = "NULL"

        for (let j = 0; j < 6; j++)
        {
            switch(j)
            {
                case 0:
                    text = i;
                    break;
                case 1:
                    text = defects[i].name;
                    break;
                case 2:
                    text = "help";
                    break;
                default:
                    text = "NULL";
            }

            newCell = newRow.insertCell(-1);
            let newText = document.createTextNode(text);
            newCell.appendChild(newText);
        }
    }
}

//For hiding file input form
function toggleForm()
{
    var form = document.getElementById("file-form");
    var formHidden = document.getElementById("file-form-hidden");

    if (form.style.display === "none")
    {
        form.style.display = "block";
        formHidden.style.display = "none";
    }
    else
    {
        form.style.display = "none";
        formHidden.style.display = "block";
    }
}