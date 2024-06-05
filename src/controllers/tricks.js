import Query from "../model/Query.js";

const getAllTricks = async (req, res) => {
    try {
        const query = "SELECT * FROM tricks JOIN categories ON tricks.categorie_id = categories.id";
        const [datas] = await Query.find(query);

        res.status(200).json( datas );
    } catch (error) {
        throw Error(error);
    }
};

const getAllCategories = async (req, res) => {
    try {
        const query = "SELECT * FROM categories";
        const [datas] = await Query.find(query);

        res.status(200).json( datas );
    } catch (error) {
        throw Error(error);
    }
};

const getTricksByCategorie = async (req, res) => {
    try {
        const query = "SELECT * FROM tricks JOIN categories ON tricks.categorie_id = categories.id WHERE label = ?";
        const [datas] = await Query.findByValue(query, req.params.label);

        res.status(200).json( datas );
    } catch (error) {
        throw Error(error);
    }
};

const getFlatTricks = async (req, res) => {
    try {
        const query = "SELECT * FROM flats";
        const [datas] = await Query.find(query);

        res.status(200).json({ datas });
    } catch (error) {
        throw Error(error);
    }
};
const getFlatTricksChecked = async (req, res) => {
    try {
        let msg = "";
        const { id, completed, backside, frontside } = req.body;

        const query = "UPDATE flats SET completed = ?, backside = ?, frontside = ? WHERE id = ?";
        const values = [completed, backside, frontside, id];

        console.log(values)

        await Query.write(query, values);

        msg = "Bien joué !";
        res.status(201).json({ msg });

    } catch (error) {
        throw Error(error);
    }
};
const getGrindAndSlide = async (req, res) => {
    try {
        const query = "SELECT * FROM grind_slides";
        const [datas] = await Query.find(query);

        res.status(200).json({ datas });
    } catch (error) {
        throw Error(error);
    }
};
const getGrabTricks = async (req, res) => {
    try {
        const query = "SELECT * FROM grabs";
        const [datas] = await Query.find(query);

        res.status(200).json({ datas });
    } catch (error) {
        throw Error(error);
    }
};
const getGapTricks = async (req, res) => {
    try {
        const query = "SELECT * FROM gaps";
        const [datas] = await Query.find(query);

        res.status(200).json({ datas });
    } catch (error) {
        throw Error(error);
    }
};
const getRampTricks = async (req, res) => {
    try {
        const query = "SELECT * FROM ramps";
        const [datas] = await Query.find(query);

        res.status(200).json({ datas });
    } catch (error) {
        throw Error(error);
    }
};



export { getAllTricks, getAllCategories, getTricksByCategorie, getFlatTricks , getFlatTricksChecked , getGrindAndSlide , getGrabTricks , getGapTricks , getRampTricks };
