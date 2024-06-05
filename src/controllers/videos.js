import Query from "../model/Query.js";
import formidable from "formidable";


const getLastVideo = async (req, res) => {
    try {
        const query = "SELECT pseudo, videos.id as video_id, title, trick_name, videos.user_id, reaction_total, publication_date FROM videos JOIN users ON users.id = videos.user_id ORDER BY videos.id DESC";
        const [datas] = await Query.find(query);

        if (!datas.length) {
            res.status(404).json({ msg: "Aucune vidéo" })
        } else {
            res.status(200).json(datas);
            return;
        }
    } catch (error) {
        throw Error(error)
    }
};

const getVideoByUserID = async (req, res) => {
    try {
        const query = "SELECT pseudo, videos.id as video_id, title, trick_name, videos.user_id, reaction_total, publication_date FROM videos JOIN users ON users.id = videos.user_id WHERE user_id = ? ORDER BY videos.id DESC";
        const [videos] = await Query.findByDatas(query, req.params);

        if (!videos.length) {
            res.status(404).json({ msg: "Aucune vidéo pour cet utilisateur" })
        } else {
            res.status(200).json(videos);
            return;
        }
    } catch (error) {
        throw Error(error)
    }
};

const getVideoByTrickName = async (req, res) => {
    try {
        const query = "SELECT pseudo, videos.id as video_id, title, trick_name, videos.user_id, reaction_total, publication_date FROM videos JOIN users ON users.id = videos.user_id JOIN tricks ON tricks.id = videos.trick_id WHERE name = ? ORDER BY videos.id DESC";
        const [videos] = await Query.findByValue(query, req.params.name);

        if (!videos.length) {
            res.status(404).json({ msg: "Aucune vidéo pour cette figure" })
        } else {
            res.status(200).json(videos);
            return;
        }
    } catch (error) {
        throw Error(error)
    }
};


const addVideo = async (req, res) => {
    try {
        let msg = "";
        const form = formidable({
            uploadDir: "public/videos",
            keepExtensions: true,
            allowEmptyFiles: false,
        });
        form.parse(req, async (error, fields, files) => {

            console.log("files video controller", files)
            console.log("fields video controller", fields)

            const video = {
                title: Object.keys(files).length ? files.video[0].newFilename : "echec.mp4",
                trick_name: fields.trick_name,
                user_Id: fields.userId,
            }

            try {
                const query = "INSERT INTO videos (title, trick_name, publication_date , user_Id) VALUES (?, ?, NOW(), ?)";  // double appostrophe pour protéger le caractère (qu'il ne soit pas interpréter par sql)
                await Query.write(query, video);
            } catch (error) {
                console.error("Erreur lors de l'insertion :", error.message);
                res.status(500).json({ error: "Erreur lors de l'insertion en base de données." });
            }

            msg = "La video a bien été uploadée";
            res.status(201).json({ msg });
        });


    } catch (error) {
        throw Error(error);
    }
};

const addReaction = async (req, res) => {
    try {

        const datas = {
            user_id: req.body.userId,
            video_id: req.body.videoId,
        };

        const checkReaction =
            "SELECT * FROM reactions WHERE user_id = ? AND video_id = ?";
        const [reaction] = await Query.findByDatas(checkReaction, [datas.user_id, datas.video_id]);


        if (!reaction.length) {

            const datas = { // donnée pour l'ajout d'une réaction
                reaction_total: req.body.reaction_totalIncr,
                user_id: req.body.userId,
                video_id: req.body.videoId,
            };

            const setUserLinkToReaction =
                "INSERT INTO reactions (reaction, user_id, video_id) VALUES(1, ?, ?)";
            await Query.write(setUserLinkToReaction, [datas.user_id, datas.video_id]);
            const setReaction =
                "UPDATE videos SET reaction_total = ? WHERE videos.id = ?";
            await Query.write(setReaction, [datas.reaction_total, datas.video_id]);

        } else {

            const datas = {  // donnée pour le retrait d'une réaction
                reaction_total: req.body.reaction_totalDecr,
                user_id: req.body.userId,
                video_id: req.body.videoId,
            };

            const setUserLinkToReaction =
                "DELETE FROM reactions WHERE user_id = ? AND video_id = ?";
            await Query.write(setUserLinkToReaction, [datas.user_id, datas.video_id]);
            const setReaction =
                "UPDATE videos SET reaction_total = ? WHERE videos.id = ?";
            await Query.write(setReaction, [datas.reaction_total, datas.video_id]);
        }

        res.status(201).json();
    } catch (error) {
        throw Error(error);
    }
};


export { getLastVideo, getVideoByUserID, getVideoByTrickName, addVideo, addReaction };