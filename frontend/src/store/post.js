import csrfFetch from "./csrf";

const GET_ONE_USER = "GET_ONE_USER";
const CREATE_POST = "post/CREATE_POST";
const REMOVE_POST = "post/REMOVE_POST";
const EDIT_POST = "post/EDIT_POST";

export const createPost = post => ({
    type: CREATE_POST,
    payload: post
})

export const removePost = postId => {
    return {
        type: REMOVE_POST,
        postId
    }
};

export const editPost = post => {
    return {
        type: EDIT_POST,
        post
    }
}

export const createPostThunk = (post) => async dispatch => {
    const { posterId, posteeId, body} = post;

    const response = await csrfFetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({
            poster_id: posterId,
            postee_id: posteeId,
            body
        })
    });

    if (response.ok) {
        const post = await response.json()
        debugger
        dispatch(createPost(post))
    }
}

export const deletePostThunk = (postId) => async dispatch => {
    debugger
    const response = await csrfFetch(`/api/posts/${postId}`, {
        method: "DELETE"
    })

    if (response.ok) {
        dispatch(removePost(postId))
    }
}

export const editPostThunk = (postId, post) => async dispatch => {
    const { posterId, posteeId, body } = post 

    debugger
    const response = await csrfFetch(`/api/posts/${postId}`, {
        method: "PATCH",
        body: JSON.stringify({
            poster_id: posterId,
            postee_id: posteeId,
            body: body
        })
    });

    debugger

    if (response.ok) {
        const post = await response.json()
        debugger
        return dispatch(editPost(post))
    }
}

const postReducer = (state = {}, action) => {
    const newState = Object.assign({}, Object.freeze(state));

    switch (action.type) {
        case GET_ONE_USER:
            // newState[action.payload.user.id] = action.payload
            const nextState = { ...newState, ...action.payload.posts }
            return nextState
        case CREATE_POST:
            const withPost = { ...newState, ...action.payload }
            return withPost
        case REMOVE_POST:
            delete newState[action.postId];
            return newState;
        case EDIT_POST:
            debugger
            const updatedPost = { ...newState, ...action.post }
            debugger
            return updatedPost;
        default:
            return state;
    }
}

export default postReducer;

