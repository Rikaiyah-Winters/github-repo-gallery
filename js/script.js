//where profile info will appear
const overview = document.querySelector(".overview");
const username = "Rikaiyah-Winters";
const repoList = document.querySelector(".repo-list");
const repos = document.querySelector(".repos");
const repoData = document.querySelector(".repo-data");
const backToRepoGallery = document.querySelector("button");
const filterInput = document.querySelector("input");


const gitUserInfo = async function () {
    const userInfo = await fetch (`https://api.github.com/users/${username}`);
    const data = await userInfo.json();
    //console.log(data);
    displayUserInfo(data);
};

gitUserInfo();

const displayUserInfo = function (data) {

    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML =`
    <figure>
    <img alt="user avatar" src=${data.avatar_url} />
  </figure>
  <div>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Bio:</strong> ${data.bio}</p>
    <p><strong>Location:</strong> ${data.location}</p>
    <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
  </div>
  `;

  overview.append(div);
  gitRepos();
};

const gitRepos = async function () {
  const fetchRepos = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
  const repoData = await fetchRepos.json();
  //console.log(repoData);
  displayRepos(repoData);
};

const displayRepos = function(repos) {
  filterInput.classList.remove("hide");
  for (const repo of repos) {
    const repoItem = document.createElement("li")
    repoItem.classList.add("repo")
    repoItem.innerHTML = `<h3>${repo.name}</h3>`;
    repoList.append(repoItem);
  }
};

repoList.addEventListener("click", function(e) {
  if (e.target.matches("h3")) {
    const repoName = e.target.innerText;
    gitRepoInfo(repoName);
  }
});

const gitRepoInfo = async function (repoName) {
const fetchInfo = await fetch (`https://api.github.com/repos/${username}/${repoName}`);
const repoInfo = await fetchInfo.json();
//console.log(repoInfo);
const fetchLanguages = await fetch (repoInfo.languages_url);
const languageData = await fetchLanguages.json();
//console.log(languageData);

const languages = [];

for (const language in languageData) {
  languages.push(language);
}

displayRepoInfo(repoInfo, languages)
};

const displayRepoInfo = async function(repoInfo, languages) {
  repoData.innerHTML = "";
  const div = document.createElement("div");
  div.innerHTML = `
  <h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
  `;
  repoData.append(div);
  repoData.classList.remove("hide");
  repos.classList.add("hide");
  backToRepoGallery.classList.remove("hide")
};

backToRepoGallery.addEventListener("click", function(){
  repos.classList.remove("hide");
  repoData.classList.add("hide");
  backToRepoGallery.classList.add("hide");
});

filterInput.addEventListener("input", function(e) {
  const searchText = e.target.value;
  //console.log(searchValue);
  const repos = document.querySelectorAll(".repo");
  const searchLowerText = searchText.toLowerCase();
  
  for (const repo of repos) {
  const repoLowerText = repo.innerText.toLowerCase();
  if (repoLowerText.includes(searchLowerText)) {
    repo.classList.remove("hide");
  } else {
    repo.classList.add("hide");
  }
  }
});

