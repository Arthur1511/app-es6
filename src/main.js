import api from "./api";

class App {
  constructor() {
    this.repositories = [];
    this.formEL = document.getElementById("repo-form");
    this.listEL = document.getElementById("repo-list");
    this.inputEl = document.querySelector("input[name=repository]");

    this.registerHandlers();
  }

  registerHandlers() {
    this.formEL.onsubmit = event => this.addRepository(event);
  }

  setLoading(loading = true){
      if(loading === true){
          let loadingEL = document.createElement('span');
          loadingEL.appendChild(document.createTextNode('Carregando'));
          loadingEL.setAttribute('id', 'loading');

          this.formEL.appendChild(loadingEL);
      }
      else{
          document.getElementById('loading').remove();
      }
  }

  async addRepository(event) {
    event.preventDefault();

    const repoInput = this.inputEl.value;

    if (repoInput.length === 0) {
      return;
    }

    this.setLoading();

    try {
      const response = await api.get(`/repos/${repoInput}`);

      const {
        name,
        description,
        html_url,
        owner: { avatar_url }
      } = response.data;

      this.repositories.push({
        name,
        description,
        avatar_url,
        html_url
      });

      this.inputEl.value = "";
      this.render();
    }
    catch(err){
        alert('O repositorio não existe');
    }

    this.setLoading(false)
  }

  render() {
    this.listEL.innerHTML = "";

    this.repositories.forEach(repo => {
      let imgEL = document.createElement("img");
      imgEL.setAttribute("src", repo.avatar_url);

      let titleEL = document.createElement("strong");
      titleEL.appendChild(document.createTextNode(repo.name));

      let descriptionEl = document.createElement("p");
      descriptionEl.appendChild(document.createTextNode(repo.description));

      let linkEL = document.createElement("a");
      linkEL.setAttribute("target", "_blank");
      linkEL.appendChild(document.createTextNode("Acessar"));
      linkEL.setAttribute("href", repo.html_url);

      let listItemEl = document.createElement("li");

      listItemEl.appendChild(imgEL);
      listItemEl.appendChild(titleEL);
      listItemEl.appendChild(descriptionEl);
      listItemEl.appendChild(linkEL);

      this.listEL.appendChild(listItemEl);
    });
  }
}

new App();
