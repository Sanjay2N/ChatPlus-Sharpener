const { CronJob } = require('cron');
const {Op} = require('sequelize');
const ChatHistory = require('../modals/chatHistory');
const ArchivedChat = require('../modals/archeivedChat');
exports.job = new CronJob(
    '0 0 * * *', 
    function () {
        archiveOldRecords();
    },
    null,
    false,
    'Asia/Kolkata'
);

async function archiveOldRecords() {
    try {
      const date = new Date();
      date.setDate(date.getDate()-10);
      // Find records to archive
      const recordsToArchive = await ChatHistory.findAll({
        where: {
          date: {
            [Op.lt]: date,
          },
        },
      });
  
      // Archive records
      await Promise.all(
        recordsToArchive.map(async (record) => {
            console.log(record.date)

          await ArchivedChat.create({
            id: record.id,
            message: record.message,
            date: record.date,
            isImage:record.isImage,
            userId: record.userId,
            groupId: record.groupId
          });
          await record.destroy();
        })
      );
      console.log('Old records archived successfully.');
    } catch (error) {
      console.error('Error archiving old records:', error);
    }
  }
