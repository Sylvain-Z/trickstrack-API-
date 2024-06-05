import Query from "../model/Query.js";

const getAllComments = async (req, res) => {
    try {
        const query = "SELECT comments.id AS id, comment, user_id, video_id, publication_date, pseudo FROM comments JOIN users ON comments.user_id = users.id";
        const [datas] = await Query.find(query);

        if (!datas.length) {
            res.status(404).json({ msg: "Aucun commentaire trouvé" })
        } else {
            res.status(200).json(datas);
            return;
        }
    } catch (error) {
        throw Error(error)
    }
};
const getVideoLastComment = async (req, res) => {
    try {
        const query = "SELECT comments.id AS id, comment, user_id, video_id, pseudo FROM comments JOIN users ON comments.user_id = users.id WHERE video_id = ? ORDER BY comments.id DESC LIMIT 1";
        const [datas] = await Query.findByDatas(query, req.params);

        if (!datas.length) {
            res.status(404).json({ msg: "Aucun commentaire pour cette vidéo" })
        } else {
            res.status(200).json(datas);
            return;
        }
    } catch (error) {
        throw Error(error)
    }
};

const getVideoAllComments = async (req, res) => {
    try {
        const query = "SELECT comments.id AS id, comment, user_id, video_id, publication_date, pseudo FROM comments JOIN users ON comments.user_id = users.id WHERE video_id = ? ORDER BY comments.id DESC";
        const [datas] = await Query.findByDatas(query, req.params);

        if (!datas.length) {
            res.status(404).json({ msg: "Aucun commentaire pour cette vidéo" })
        } else {
            res.status(200).json(datas);
            return;
        }
    } catch (error) {
        throw Error(error)
    }
};

const addComment = async (req, res) => {
    try {
        const datas = {
            comment : req.body.comment,
            user_id: req.body.userId,
            video_id: req.body.videoId,
        };

        const query =
            "INSERT INTO comments (comment, publication_date, user_id, video_id) VALUES ( ?, NOW(), ?, ?)";
        await Query.write(query, datas);

        res.status(201).json();

    } catch (error) {
        throw Error(error);
    }
};


export { getAllComments, getVideoLastComment, getVideoAllComments, addComment };