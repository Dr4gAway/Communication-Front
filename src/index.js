const url = 'http://localhost:3000';

//Valores para adicionar o muito louco novo

const projectNumber = document.getElementById('projectNumber');
const projectDifficulty = document.getElementById('projectDifficulty');
const projectDescription = document.getElementById('projectDescription');
const projectApplication = document.getElementById('projectApplication');
const projectCopy = document.getElementById('projectCopy');
const projectContingency = document.getElementById('projectContingency');

//Modal inputs

const modalNumber = document.getElementById('edit-number');
const modalDescription = document.getElementById('edit-description');
const modalApplication = document.getElementById('edit-application');
const modalDifficulty = document.getElementById('edit-difficulty');
const modalContingency = document.getElementById('edit-contingency');
const modalCopy = document.getElementById('edit-copy');

const modal = document.getElementById('modal');
const modalFade = document.getElementById('modal-fade');
const saveButton = document.getElementById('saveButton');

//Search Inputs

const searchButton = document.getElementById('search-projects-button')
const warningLabel = document.getElementById('projects-warning');

const searchValue = document.getElementById('search-projects-input');

function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

const verifyProject = () => {
    if(projectNumber.value < 1 || projectNumber.value > 999 || isEmptyOrSpaces(projectNumber.value))
        return 1;

    if(projectDifficulty.value < 1 || projectDifficulty.value > 5)
        return 1;

    if(projectDescription.value.lenght > 200 || isEmptyOrSpaces(projectDescription.value))
        return 1;

    if(projectApplication.value.lenght > 100 || isEmptyOrSpaces(projectApplication.value))
        return 1;

    if(projectCopy.value.lenght > 100 || isEmptyOrSpaces(projectCopy.value))
        return 1;

    if(projectContingency.value.lenght > 100 || isEmptyOrSpaces(projectDescription.value))
        return 1;

    return 0;
}

const createProject = (project) => {
    const newProject = document.createElement('div');
    newProject.classList.add('project');
    
    newProject.innerHTML = `
        <div class="project-heading">
            <div class="project-h-content">
                <span>Projeto</span>
                <span>#${project.identificacao}</span>
            </div>
            <div class="project-h-content">
                <span>Dificuldade</span>
                <span>${project.nivel}</span>
            </div>
        </div>

        <div class="project-content">
            <div class="project-field">
                <span>Descrição</span>
                <p>${project.descricao}</p>
            </div>
            <div class="project-field">
                <span>Aplicação</span>
                <p>${project.aplicacao}</p>
            </div>
            <div class="project-field">
                <span>Setores para cópia</span>
                <p>${project.copiado}</p>
            </div>
            <div class="project-field">
                <span>Contingência</span>
                <p>${project.contingencia}</p>
            </div>
        </div>

        <div class="project-footer">
            <div class="footer-edit" onClick="loadProject(${project.id})">
                <span class="material-symbols-outlined">edit</span>
                <span>Editar</span>
            </div>
            <div class="footer-exclude" onClick="excludeProject(${project.id})">
                <span class="material-symbols-outlined">delete</span>
                <span>Excluir</span>
            </div>
        </div>
    `;

    document.querySelector("#projectGroup").appendChild(newProject);
}

const addProject = () => {

    if(verifyProject())
        return alert('Algum dos campos está errado!');

    fetch(url+`/projeto/`, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
            "ident": projectNumber.value,
            "desc": projectDescription.value,
            "apli": projectApplication.value,
            "nivel": projectDifficulty.value,
            "cont": projectContingency.value,
            "copiado": projectCopy.value
        })
    })
    .then(res => res.json())
    .then(res => {
        if(!res) return

        alert("Deus está morto, mas seu código funciona!")
        showProjects();

        projectNumber.value = '';
        projectDifficulty.value = '';
        projectDescription.value = '';
        projectApplication.value = '';
        projectCopy.value = '';
        projectContingency.value = '';
    })
}

const showProjects = () => {
    fetch(url+`/projeto`)
    .then(res => res.json())
    .then(res => {
        clearProjects();

        res.forEach(project => createProject(project));
        
        hideWarning(res);
    });

    searchValue.value = '';
}

const clearProjects = () => {
    const projects = document.querySelectorAll('.project');

    projects.forEach(project => project.remove())
}

const excludeProject = (id) => {
    fetch(url+`/projeto/${id}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ "id":id })
      })
      .then(res => res.json())
      .then(res => {
        if(!res) return;

        alert("Deus está vivo, mas seu projeto foi deletado!");

        showProjects();
      })
}

const loadProject = (id) => {
    toggleModal();

    saveButton.onclick = () => {
        fetch(url+`/projeto/${id}`, {
            method: 'PUT',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                "ident": modalNumber.value,
                "desc": modalDescription.value,
                "apli": modalApplication.value,
                "nivel": modalDifficulty.value,
                "cont": modalContingency.value,
                "copiado": modalCopy.value
            })
        })
        alert("Humanos morrem, mas seu arquivo é salvo!");
        toggleModal();
        showProjects();
    }

    fetch(url+`/projeto/select/${id}`)
    .then(res => res.json())
    .then(res => {
        modalNumber.value = res.identificacao;
        modalDifficulty.value = res.nivel;
        modalDescription.value = res.descricao;
        modalApplication.value = res.aplicacao;
        modalCopy.value = res.copiado;
        modalContingency.value = res.contingencia;
    })
}

const hideWarning = (projects) => {

    if(!projects.length) {
        warningLabel.classList.remove('hide')
    } else {
        warningLabel.classList.add('hide')
    }
}

const showDelete = () => {
    if(searchButton.classList.contains('hide')) {
        searchButton.classList.remove('hide');
    }
}

const searchProjects = () => {

    clearProjects()

    fetch(url+`/projeto/pesquisa?search=${searchValue.value}`)
    .then(res => res.json())
    .then(res => {
        res.forEach(project => createProject(project));

        hideWarning(res);
    })
}

const toggleModal = () => {
    modal.classList.toggle('hide');
    modalFade.classList.toggle('hide');

    modalNumber.value = '';
    modalDifficulty.value = '';
    modalDescription.value = '';
    modalApplication.value = '';
    modalCopy.value = '';
    modalContingency.value = '';
}


showProjects();