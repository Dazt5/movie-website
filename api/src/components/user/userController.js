import Users from '$models/Users'


const findUser = async (req, res) => {

    const { id } = req.params;

    try {
        const user = await Users.findOne({
            where: {
                id
            }
        })

        if (!user) {
            return res.status(404).json({
                message: 'El Usuario que intenta buscar no existe.'
            });

        }

        res.status(200).json({
            user
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Ha ocurrido un error inesperado...'
        });
    }
}

export {
    findUser
}