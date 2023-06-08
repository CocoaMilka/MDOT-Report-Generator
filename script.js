const fileInput = document.getElementById("file-input");

const test = document.getElementById("testing")

fileInput.addEventListener("change", () => {
    const inputReader = new FileReader();

    //.files returns an array in case multiple files are uploaded, select first element since upload form is limited to one file at a time
    inputReader.readAsText(fileInput.files[0]);

    //Reading file takes time, will execute once file is loaded then convert JSON into a javascript object
    inputReader.addEventListener("load", () => {
        data = JSON.parse(inputReader.result);

        grabSections(data);
    })
})


function grabSections(data)
{
    Substructure_table = document.getElementById("SUBSTRUCTURE_Table");

    // Grabs root level attributes (Table titles in form)

    var GSI = data.subFields[0];
    var BII = data.subFields[1];
    var SC = data.subFields[2];

    // Array of substructure components 
    var components = getLeaf(SC);

    for (var i = 0; i < components.length; i++)
    {
        // each iteration represents a component
        // returns an array of objects containing each component attribtue for each component i
        var component = getLeaf(components[i]);
        //console.log(component);

        newRow = Substructure_table.insertRow(-1);
        newCell = newRow.insertCell(-1);
        newCell.outerHTML = "<th>" + component[0].name + "</th>";
        //console.log(component[0].name);

        
        //Grabs each component attribute value, why is everyting an object? smh my head
        for (var j = 2; j < component.length; j++)
        {
            var component_attribute = getLeaf(component[j]);

            if (component_attribute.length == 0)
            {
                component_attribute = "null";
                newCell = newRow.insertCell(-1);
                newCell.outerHTML = "<td>null</td>";
                //console.log("null");
            }
            else
            {
                newCell = newRow.insertCell(-1);
                newCell.outerHTML = "<td>" + component_attribute[0].name + "</td>";
                //console.log(component_attribute[0].name);
            }
        }
    }
}

function getLeaf(root)
{
    var tmp = root;
    while (tmp.subFields !== undefined)
    {
        tmp = tmp.subFields;
    }

    return tmp;
}

function parseData_OLD(data)
{
    //Grab tables to write to
    BII_Table = document.getElementById("BII_table");
    Deck_Table = document.getElementById("deck_table");
    CGR_Table = document.getElementById("CGR_table");

    let defects = data["subFields"][0].subFields;
    let inspectors = data.subFields[1].subFields[1].subFields;

    //Manual parse for inspection date, bad practice but JSON structure is unpredictable
    document.getElementById("date_BII").textContent = data["subFields"][1]["subFields"][0]["subFields"][0]["name"];

    // Adds all inspectors into the form
    for (var i in inspectors)
    {
        newRow = BII_Table.insertRow(-1);
        newCell = newRow.insertCell(0);
        newCell.outerHTML = "<th>INSPECTOR " + i + ":</th>";

        let inspectorName = document.createTextNode(inspectors[i].name);
        newCell = newRow.insertCell(1);
        newCell.appendChild(inspectorName);
    }

    for (var i in defects)
    {
        //console.log(defects[i].name);
        newRow = Deck_Table.insertRow(-1);
        
        let text = "NULL"

        // Populates DECK table, each case handles the ith column
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
                    text = defects[i].subFields[0].subFields[0].name;
                    break;
                case 3:
                    text = defects[i].subFields[1].subFields[0].name;
                    break;
                case 4:
                    text = String(defects[i].subFields[2].measurements[0].length);
                    console.log(defects[i].subFields[2].name);
                    break;
                default:
                    text = "NULL";
            }

            newCell = newRow.insertCell(-1);
            newCell.innerText = text;
            //let newText = document.createTextNode(text);
            //newCell.appendChild(newText);
        }

        // Populates CGR table
        newRow = CGR_Table.insertRow(-1);
        for (let i = 0; i < 6; i++)
        {
            newCell = newRow.insertCell(-1);
            newCell.innerText = "NULL";
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