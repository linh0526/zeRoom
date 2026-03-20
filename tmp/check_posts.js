const mongoose = require('mongoose');
const uri = 'mongodb://lyan0526:1234@ac-ka6an9y-shard-00-00.mwcqetw.mongodb.net:27017,ac-ka6an9y-shard-00-01.mwcqetw.mongodb.net:27017,ac-ka6an9y-shard-00-02.mwcqetw.mongodb.net:27017/zeRoom?replicaSet=atlas-v0l71t-shard-0&ssl=true&authSource=admin';

async function run() {
  try {
    await mongoose.connect(uri);
    const PostSchema = new mongoose.Schema({ status: String }, { strict: false });
    const Post = mongoose.models.Post || mongoose.model('Post', PostSchema, 'posts');
    const counts = await Post.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    console.log(JSON.stringify(counts));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
