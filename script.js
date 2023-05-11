const API = 'https://jsonplaceholder.typicode.com'

const body = document.querySelector('body');
const idInput = document.querySelector('#postId');
const findPostBtn = document.querySelector('#findPost');

getData = path => fetch(path).then(response => response.json());

idInput.addEventListener('input', () => {
    //if value of idInput equals to 0 or more then 100, then we adding disable attribute to findPostBtn.
    //if its not -- we removing that attribute.
    //thats because we can only get post with ids from 1 to 100
    value = idInput.value;

    (value > 0 && value <= 100)
        ? findPostBtn.removeAttribute('disabled')
        : findPostBtn.setAttribute('disabled', '');

})

findPostBtn.addEventListener('click', () => {
    //if findPostBtn clicked, then we must render a post with id, that was entered inside of input
    const id = idInput.value;

    getData(API + '/posts/' + id)
        .then(data => renderPost(data));
});

function renderPost(post) {
    if (document.querySelector(`.id-${post.id}`)) { return 0 }; //if post alreaty rendered, we'll not render it again.

    const postDiv = document.createElement('div');
    const postHeading = document.createElement('h3')
    const postText = document.createElement('p');
    const showCommentsBtn = document.createElement('button');
    const hideCommentsBtn = document.createElement('button');

    postText.innerText = post.body;
    postHeading.innerText = post.title;
    showCommentsBtn.innerText = 'Show comments';
    hideCommentsBtn.innerText = 'Hide comments'

    postDiv.classList.add('post');
    postDiv.classList.add(`id-${post.id}`); //we need that class for removing comments inside of the block, in future.
    hideCommentsBtn.classList.add('d-none')

    //if showCommentsBtn clicked, it'll get display: none (so user can't press it again, because he'll append same comments again, otherwise).
    //hideCommentsBtn will now have display: block, which make it clickable.
    showCommentsBtn.addEventListener('click', () => {
        showCommentsBtn.classList.add('d-none');
        hideCommentsBtn.classList.remove('d-none');

        getData(API + '/comments?postId=' + post.id)
            .then(data => renderComments(postDiv, data))
    });

    //if hideCommentsBtn clicked, it'll get display: none, so there will be only showCommentsBtn again.
    //also divs with class comment, will be removed.
    hideCommentsBtn.addEventListener('click', () => {
        showCommentsBtn.classList.remove('d-none');
        hideCommentsBtn.classList.add('d-none');

        const comments = document.querySelectorAll(`.id-${post.id} .comment`);
        comments.forEach(comment => comment.remove());
    })

    postDiv.append(postHeading);
    postDiv.append(postText);
    postDiv.append(showCommentsBtn);
    postDiv.append(hideCommentsBtn);
    body.append(postDiv);
}

function renderComments(container, comments) {
    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        const commentP = document.createElement('p');

        commentDiv.classList.add('comment');

        commentP.innerText = comment.body;

        commentDiv.append(commentP);
        container.append(commentDiv);
    });
}