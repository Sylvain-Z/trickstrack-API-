import Query from "../model/Query.js";
import { hash } from "bcrypt";
import bcrypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken";

const { sign } = jsonwebtoken;
const { SK } = process.env;
const SALT = 10;

const check_token = async (req, res) => {
    try {
        const queryUser = "SELECT email FROM users WHERE id = ?";
        await Query.findByValue(queryUser, req.params.id);
        res.status(200).json({ msg: "Vérifié", id: queryUser.id })
    } catch (error) {
        throw Error(error);
    }
};

const createAccount = async (req, res) => {
    try {
        let msg = "";
        let msg2 = "";
        let msg3 = "";
        const datas = {
            pseudo: req.body.pseudo,
            email: req.body.email,
            password: req.body.password,
        };

        // Expression régulière pour la validation du format des champs
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,12}$/;

        if (!emailRegex.test(datas.email)) {
            return res.status(400).json({ msg: "L'email n'est pas dans un format valide" })
        }
        if (!passwordRegex.test(datas.password)) {
            return res.status(400).json({ msg: "Le mot de passe doit contenir au moins une lettre minuscule, une lettre majuscule, un caractère spécial et a une longueur comprise entre 8 et 12 caractères." })
        }

        // Vérification de l'unicité de l'email
        const queryUser =
            "SELECT email FROM users WHERE email = ?";
        const [user] = await Query.findByDatas(queryUser, datas);

        if (user.length) {
            msg = "Un utilisateur avec cet email existe déjà";
            res.status(409).json({ msg });

        } else {
            const datas = {
                id: req.body.newUserId,
                pseudo: req.body.pseudo,
                email: req.body.email,
                password: await hash(req.body.password, SALT),
            };

            const query =
                "INSERT INTO users (id, pseudo, email, password, registration_date) VALUES(?, ?, ?, ?, NOW())";
            await Query.write(query, datas);

            msg2 = "Votre compte a bien été créé";
            msg3 = "Rendez-vous sur la page de connexion";
            res.status(201).json({ msg2, msg3 });
        }
    } catch (error) {
        throw Error(error);
    }
};


const signin = async (req, res) => {
    try {
        let msg = "";
        const datas = { email: req.body.email };
        const queryUser = "SELECT * FROM users WHERE email = ?";
        const [user] = await Query.findByDatas(queryUser, datas);

        if (user.length) {
            msg = "Votre compte a été trouvé";
            const matchPassword = await bcrypt.compare(req.body.password, user[0].password);

            if (matchPassword) {
                const TOKEN = sign({ id: user[0].id }, SK); 
                const userId = user[0].id;

                console.log("userId", userId)

                res.status(200).json({ msg, TOKEN, userId });
            } else {
                msg = "L'email ou le mot de passe est incorrecte";
                res.status(401).json({ msg })
            }

        } else {
            msg = "L'email ou le mot de passe est incorrecte";
            res.status(409).json({ msg });
        }
    } catch (error) {
        throw Error(error);
    }
};

const getAllUsers = async (req, res) => {

    const queryUser = "SELECT * FROM users";
    const [user] = await Query.find(queryUser);

    res.status(200).json({ user });
};

const userInformations = async (req, res) => {

    const queryUser = "SELECT * FROM users WHERE users.id = ?";
    const [user] = await Query.findByDatas(queryUser, req.params);

    if (!user.length) {
        res.status(404).json({ msg: "utilisateur non reconnu" })
    } else {
        res.status(200).json(user);
        return;
    }
};

const updateUserInfos = async (req, res) => {
    try {
        let msg = "";
        let msg2 = "";
        const datas = {
            pseudo: req.body.pseudo,
            firstname: req.body.firstname,
            bio: req.body.bio,
            email: req.body.email,
            id: req.body.id,
        };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(datas.email)) {
            return res.status(400).json({ msg: "L'email n'est pas dans un format valide" })
        }

        const queryUser = "SELECT * FROM users WHERE users.pseudo = ?";
        const [user] = await Query.findByValue(queryUser, datas.pseudo);
    
        if (user.length) {
            res.status(200).json({ msg2: "Un utilisateur avec ce pseudo existe déjà" })
        } else {

            const query =
                "UPDATE users SET pseudo = ? , firstname = ? , bio = ? , email = ? WHERE id = ?";
            await Query.write(query, datas);
    
            msg = "Vos informations ont été mise à jour !";
            res.status(201).json({ msg });

        }

    } catch (error) {
        throw Error(error);
    }
};

const updatePassword = async (req, res) => {
    try {
        let msg = "";
        const datas = {
            password: await hash(req.body.password, SALT),
            id: req.body.id,
        };

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,12}$/;

        if (!passwordRegex.test(req.body.password)) {
            return res.status(400).json({ msg: "Le mot de passe doit contenir au moins une lettre minuscule, une lettre majuscule, un caractère spécial et a une longueur comprise entre 8 et 12 caractères." })
        }

        const query =
            "UPDATE users SET password = ? WHERE users.id = ?";
        await Query.write(query, datas);

        msg = "Vos informations ont été mise à jour !";
        res.status(201).json({ msg });

    } catch (error) {
        throw Error(error);
    }
};

const deleteUser = async (req, res) => {
    try {
        let msg = ""
        const query =
            "DELETE FROM users WHERE id = ?";
        await Query.deleteByValue(query, req.params.id);

        msg = "Le profil a été supprimé";
        res.status(201).json({ msg });

    } catch (error) {
        throw Error(error);
    }
};



export { check_token, createAccount, signin, getAllUsers, userInformations, updateUserInfos, updatePassword, deleteUser };
