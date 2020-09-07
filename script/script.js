const xhrBooks = new XMLHttpRequest();
xhrBooks.open("POST","http://localhost:4000/graphql",true);
xhrBooks.setRequestHeader("Content-Type","application/json");
let queryBooks = {query:`{
            books{
                id,
                titre,
                author{
                    id,
                    name
                }
            }
        }`};
xhrBooks.onreadystatechange = function () {
    if(xhrBooks.readyState === XMLHttpRequest.DONE && xhrBooks.status === 200){
        let div = document.getElementById('booksListe');
        let ul = document.createElement('ul');
        div.appendChild(ul);

        const result = JSON.parse(xhrBooks.responseText);

        result.data.books.forEach(function (item) {
            let li = document.createElement('li');
            li.innerHTML = item.titre + ": L'auteur de ce livre est: " + item.author.name;
            ul.appendChild(li);
        })
    }
};
xhrBooks.send(JSON.stringify(queryBooks));

function sendNewBook(book,author){
    if (book !== "" && author !== ""){
        let queryAuthor = {query:`{
                author(name:"${author}"){
                    id,
                    name
                }
            }`
        };

        const xhrFindAuthor = new XMLHttpRequest();
        xhrFindAuthor.open("POST","http://localhost:4000/graphql",true);
        xhrFindAuthor.setRequestHeader("Content-Type","application/json");
        xhrFindAuthor.onreadystatechange = function () {
            if(xhrFindAuthor.readyState === XMLHttpRequest.DONE && xhrFindAuthor.status === 200){
                const result = JSON.parse(xhrFindAuthor.response);
                if(result.data.author === null){
                    let mutationNewAuthor = {query:`
                        mutation{
                                addAuteur(name:"${author}"){
                                    id,
                                    name
                                }
                        }`};
                    const xhrNewAuthor = new XMLHttpRequest();
                    xhrNewAuthor.open("POST","http://localhost:4000/graphql",true);
                    xhrNewAuthor.setRequestHeader("Content-Type","application/json");
                    xhrNewAuthor.onreadystatechange = function () {
                        if(xhrNewAuthor.readyState === XMLHttpRequest.DONE && xhrNewAuthor.status === 200){
                            const result = JSON.parse(xhrNewAuthor.response);
                            let div = document.getElementById('newAuthor');
                            let p = document.createElement('p');
                            div.appendChild(p);
                            p.innerHTML = `L'auteur ${result.data.addAuteur.name} a été créé`;
                        let mutationNewBook = {query:`
                            mutation{
                                addBook(titre:"${book}",authorId:${result.data.addAuteur.id}){
                                    titre
                                }
                            }`};

                        const xhrNewBook = new XMLHttpRequest();
                        xhrNewBook.open("POST","http://localhost:4000/graphql",true);
                        xhrNewBook.setRequestHeader("Content-Type","application/json");
                        xhrNewBook.onreadystatechange = function () {
                            if(xhrNewBook.readyState === XMLHttpRequest.DONE && xhrNewBook.status === 200){
                                const result = JSON.parse(xhrNewBook.response);
                                let div = document.getElementById('book');
                                let p = document.createElement('p');
                                div.appendChild(p);
                                p.innerHTML = `Le livre ${result.data.addBook.titre} a été créé`
                            }
                        };
                        xhrNewBook.send(JSON.stringify(mutationNewBook));
                        }
                    };
                    xhrNewAuthor.send(JSON.stringify(mutationNewAuthor));
                }
                else
                {
                    let mutationNewBook = {query:`mutation{
                    addBook(titre:"${book}",authorId:${result.data.author.id}){
                            titre,
                        }
                    }`};
                    const xhrNewBook = new XMLHttpRequest();
                    xhrNewBook.open("POST","http://localhost:4000/graphql",true);
                    xhrNewBook.setRequestHeader("Content-Type","application/json");
                    xhrNewBook.onreadystatechange = function () {
                        if(xhrNewBook.readyState === XMLHttpRequest.DONE && xhrNewBook.status === 200){
                            const result = JSON.parse(xhrNewBook.response);
                            let div = document.getElementById('book');
                            let p = document.createElement('p');
                            div.appendChild(p);
                            p.innerHTML = `Le livre ${result.data.addBook.titre} a été créé`
                        }
                    };
                    xhrNewBook.send(JSON.stringify(mutationNewBook));
                }
            }
        };
        xhrFindAuthor.send(JSON.stringify(queryAuthor));
    }
    else{
        alert('Vous devez indiquer un livre et un auteur')
    }
}
