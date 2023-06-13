const Story = require('../model/story.js');

const create = async (req, res) => {
    try {
        const storyObj = {
            title: req.body.title,
            status: req.body.status,
            message: req.body.message,
            userId: req.user._id
        }

        await Story.create(storyObj);

        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
}

const edit = async (req, res) => {
    try {
        const story = await Story.findOne({ _id: req.params.id }).lean();
    
        res.render('edit', {
            story
        });
    } catch (error) {
        console.log(error);
        res.render('504')
    }
}

const update = async (req, res) => {
    try {
        await Story.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true });

        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        res.render('error', { error });
    }
}

const deleteStory = async (req, res) => {
    try {
        await Story.findByIdAndDelete({ _id: req.params.id });

        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        res.render('error', { error });
    }
}

const publicStories = async (req, res) => {
    try {
        const stories = await Story.find({ status: 'Public' }).populate({ path: 'userId' }).lean();

        console.log(stories);

        res.render('stories', {
            stories
        });
    } catch (error) {
        console.log(error);
        res.render('error', { error });
    }
}

module.exports = {
    create,
    edit,
    update,
    deleteStory,
    publicStories
}