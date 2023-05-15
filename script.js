// Calls getFile() when a file has been uploaded to the input form, basic JS syntax rookie
//document.getElementById('file-input').addEventListener('change', getFile);

function getFile(event)
{
    const input = event.target
    print(input)
}

function readFileContent(file)
{
    const reader = new FileReader()
    return new Promise((resolve, reject) => 
    {
        reader.onload = event => resolve(event.target.result)
        reader.onerror = error => reject(error)
        reader.readAsText(file)
    })
}

//For hiding file input form
//document.getElementById("hide-file-form").addEventListener("click", hideForm);

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