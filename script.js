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

    // Array of substructures 
    var substructures = getLeaf(SC);

    // comment

    for (var i = 0; i < substructures.length; i++)
    {
        // each iteration represents a Substructure
        // returns an array of objects containing each substructure attribtue for each substructure i
        var substructure = getLeaf(substructures[i]);
        //console.log(getLeaf(substructure[1]));

        newRow = Substructure_table.insertRow(-1);
        newCell = newRow.insertCell(-1);
        newCell.outerHTML = "<th>" + substructure[0].name + "</th>";
        //console.log(component[0].name);

        
        // Grabs each substructure attribute value, why is everyting an object? smh my head
        // This will populate substructure rows
        for (var j = 2; j < substructure.length; j++)
        {
            var component_attribute = getLeaf(substructure[j]);

            if (component_attribute.length == 0)
            {
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

        // Associated component row per substructure
        newRow = Substructure_table.insertRow(-1);
        newCell = newRow.insertCell(0);
        newCell.outerHTML = create_Component_table(substructure[1].subFields[0].name, i);

        // This will populate associated component table for each substructure component
        var tableID = substructure[1].subFields[0].name + i;
        var current_table = document.getElementById(tableID.toString());
        

        var components = getLeaf(substructure[1]);

        for (var k = 0; k < components.length; k++)
        {
            // Substructures have multiple components
            // Grabs each component array containing their attributes
            var component = getLeaf(components[k]);
            //console.log(current_component);

            // Populate table with attributes
            newRow = current_table.insertRow(-1);
            for (var n = 0; n < component.length; n++)
            {
                var current_component = component[n];
                console.log(current_component);

                if (current_component.subFields !== undefined)
                {
                    var attributes = getLeaf(current_component);
                    console.log(n);
    
                    // create table then add attributes
                    newAttributeCell = newRow.insertCell(-1);
                    newAttributeCell.outerHTML = create_attribute_table(current_component.name, i, k);
    
                    var attributeTableID = current_component.name + i + k;
                    var attribute_table = document.getElementById(attributeTableID.toString());
    
                    // Lists all values for multi valued attributes
                    for (var l = 0; l < attributes.length; l++)
                    {
                        //console.log(attributes[l].name);
    
                        var data = attributes[l].name;
    
                        if (attributes[l].measurements !== undefined)
                        {
                            data = attributes[l].measurements[0].length;
                        }
    
                        newAttributeRow = attribute_table.insertRow(-1);
                        newAttributeCell = newAttributeRow.insertCell(-1);
                        newAttributeCell.outerHTML = "<td>" + data + "</td>";
                    }
                    
                }
                else
                {
                    newCell = newRow.insertCell(-1);
                    newCell.outerHTML = "<td>" + current_component.name + "</td>";
                }
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

// Creates a template table to insert components
// the table ID is made up of the component name + order number to create a unique key for populating elements
function create_Component_table(tableID, identifier)
{
    var html = "";

    html += "<tr>" +
        "<td colspan=\"9\">" +
            "<table class=\"table-component\" id=\"" + tableID + identifier + "\">" +
                "<tr>" +
                    "<th scope=\"colgroup\">ASSOCIATED COMPONENT</th>" +
                    "<th scope=\"colgroup\">CONDITION</th>" +
                    "<th scope=\"colgroup\">LOCATION 1</th>" +
                    "<th scope=\"colgroup\">LOCATION 2</th>" +
                    "<th scope=\"colgroup\">SEVERITY</th>" +
                    "<th scope=\"colgroup\">MEASUREMENT</th>" +
                    "<th scope=\"colgroup\">COMMENT</th>" +
                "</tr>" +
            "</table>" +
        "</td>" +
    "</tr>";

    return html;
}

function create_attribute_table(tableID, identifier1, identifier2)
{
    var html = "";

    html += "<td>" +
        "<table class =\"table-nested\" id=\"" + tableID + identifier1 + identifier2 + "\">" +
        "</table>" +
    "</td>";

    return html;
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