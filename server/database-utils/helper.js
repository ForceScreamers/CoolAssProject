const { DEBT_STATE } = require('../server-data/consts');
const { connectToDb, getDb } = require('./db')
const { ObjectId } = require('mongodb')

let db;

// db connection
connectToDb((err) => {
    if (!err) {
        db = getDb();
    }
})

// ! debug
let groupCount = 0;

// TODO: Create an error handler for queries instead of catch(()=>{})

module.exports = {
    GetUsers: async function () {
        let users = []
        await db.collection("users")
            .find()
            .forEach(book => { users.push(book) })
            .catch((err) => {
                console.log(err)
            })
        return users;
    },
    DoesGroupExistByCode: async function (groupCode) {
        let groupCount = await db.collection("groups")
            .count({
                code: groupCode
            })
            .catch(err => console.log(err))
        return groupCount == 0 ? false : true
    },
    DoesUserExist: async function (userId) {
        // Check if exists
        let userCount = await db.collection("users")
            .count({
                _id: new ObjectId(userId)
            })
            .catch(err => console.log(err))
        return userCount == 0 ? false : true
    },
    GetUserPaymentData: async function (userId) {
        let userData = await db.collection("users")
            .find({ _id: new ObjectId(userId) })
            .project({ _id: 1, amount: 1, bill: 1, change: 1 })
            .toArray()

        return userData[0];
    },
    // GetGroupPaymentData: async function (groupId) {
    //     let dbUserIds = await db.collection("groups")
    //         .find({
    //             _id: new ObjectId(groupId)
    //         })
    //         .toArray()

    //     // Parse into list of IDs ONLY
    //     let parsedUserIds = []
    //     dbUserIds[0].user_ids.forEach(userId => {
    //         parsedUserIds.push(userId)
    //     })

    //     let projectionFields = { _id: 1, amount: 1, bill: 1, change: 1 }

    //     let users = await db.collection("users").find({ _id: { $in: parsedUserIds } }).project(projectionFields).toArray()

    //     return users;
    // },
    AddNewUser: async function (username, defaultProps) {
        //  Add user
        let userId;

        await db.collection("users")
            .insertOne({
                username: username,
                ...defaultProps,
                // amount: defaultProps.amount,
                // bill: defaultProps.bill,
                // change: defaultProps.change,
                // is_manager: defaultProps.is_manager,
                // is_ready: defaultProps.is_ready,
                // done_with_leftover: defaultProps.done_with_leftover,
                // done_with_payment: defaultProps.done_with_payment
            })
            .then(result => {
                userId = result.insertedId;
            })
            .catch(err => console.log(err))

        return userId;

    },
    ResetUserProps: async function (userId, defaultProps) {
        await db.collection("users").updateOne(
            {
                _id: new ObjectId(userId)
            },
            {
                $set: { ...defaultProps }
            }
        )
    },
    AddDebt: async function (creditorId, debtorId, amount) {
        // * currently passing usernames as well as ids to make the lookup easier, in the future can maybe use only 
        // * ids and join the documents

        await db.collection("debts").updateOne(
            {
                creditor_id: new ObjectId(creditorId),
                debtor_id: new ObjectId(debtorId),
            },
            { $inc: { amount: amount } },
            { upsert: true }
        )
    },

    GroupIsEmpty: async function (groupId) {
        let count = await this.GetGroupUserCount(groupId)

        return count == 0
    },
    DeleteGroup: async function (groupId) {
        //!debug
        groupCount--;

        await db.collection("groups")
            .deleteOne(
                { _id: new ObjectId(groupId) }
            )

    },

    AddUserToGroupById: async function (userId, groupId) {
        await db.collection("groups")
            .updateOne(
                { _id: new ObjectId(groupId) },
                { $addToSet: { user_ids: new ObjectId(userId) } })
            .catch((err) => {
                test = false;
                console.error(err)
            })
    },
    AddUserToGroupByCode: async function (userId, groupCode) {
        // Get group id by group code

        let groupId = await db.collection("groups")
            .find({ code: groupCode })
            .toArray()


        return this.AddUserToGroupById(userId, groupId[0]._id.toString());
    },
    RemoveUserFromGivenGroup: async function (userId, groupId) {

        await db.collection("groups")
            .updateOne(
                { _id: new ObjectId(groupId) },
                { $pull: { user_ids: new ObjectId(userId) } })
            .catch((err) => {
                console.log(err)
            })
    },
    RemoveUserFromParentGroup: async function (userId) {
        let parentGroupId = await this.GetParentGroupId(userId);

        console.log(userId)
        console.log(parentGroupId)

        if (parentGroupId) {
            await db.collection("groups")
                .updateOne(
                    { _id: new ObjectId(parentGroupId) },
                    { $pull: { user_ids: new ObjectId(userId) } })
                .catch((err) => {
                    console.log(err)
                })
        }
        else {
            console.log("helper 175: no parent group ID");
        }

        return parentGroupId;
    },
    IsUserInAnyGroup: async function (userId) {
        // TODO: Consider searching with an index
        let userCount = await db.collection("groups")
            .count({
                user_ids: { $in: [new ObjectId(userId)] }
            })
            .catch(err => console.log(err))

        if (userCount > 0) {
            return true;
        } else {
            return false;
        }
    },
    CreateGroupForUser: async function (userId) {

        // !debug
        groupCount++;

        let groupId;

        if (await this.IsUserInAnyGroup(userId) === false) {
            // Add new group
            await db.collection("groups")
                .insertOne({
                    user_ids: [new ObjectId(userId)],
                    tip_percent: 0,
                    code: groupCount
                })
                .then(result => {
                    groupId = result.insertedId;
                })
                .catch((err) => {
                    console.log(err)
                })

            // Change user to manager
            await db.collection("users")
                .updateOne({
                    _id: new ObjectId(userId)
                }, { $set: { is_manager: true } })
                .catch(err => console.log(err))
        }
        else {
            console.log("cant create group, already in group!")
        }

        return groupId;
    },
    GetGroupById: async function (groupId) {
        // Get list of user ids
        let dbUserIds = await db.collection("groups")
            .find({ _id: new ObjectId(groupId) })
            .toArray()

        // Parse into list of IDs ONLY
        let parsedUserIds = []
        dbUserIds[0].user_ids.forEach(userId => {
            parsedUserIds.push(userId)
        })

        // Get the users' data by the list of IDs, ommiting the secret stuff (user_id...)
        let users = await db.collection("users").find({ _id: { $in: parsedUserIds } }).toArray()

        return users;
    },
    GetGroupByUser: async function (userId) {
        // Get user ids 
        // TODO: Add get group tip to display


        let dbUserIds = await db.collection("groups")
            .find({
                user_ids: { $in: [new ObjectId(userId)] }
            })
            .toArray()


        // Parse into list of IDs ONLY
        let parsedUserIds = []
        dbUserIds[0].user_ids.forEach(userId => {
            parsedUserIds.push(userId)
        })

        // Get the users by the list of IDs, ommiting the secret stuff (user_id...)
        let users = await db.collection("users").find({ _id: { $in: parsedUserIds } }).toArray()

        return users;
    },
    UpdateUsername: async function (userId, newUsername) {
        await db.collection("users")
            .updateOne({ _id: new ObjectId(userId) }, { $set: { username: newUsername } })
    },
    UpdateUserPaymentDetails: async function (userId, paymentData) {

        await db.collection("users")
            .updateOne(
                { _id: new ObjectId(userId) },
                {
                    $set: {
                        amount: paymentData.amount,
                        bill: paymentData.bill,
                        change: paymentData.change,//TODO check if nessesary
                    }
                })
    },
    SetDoneWithPayment: async function (userId, isDoneWithPayment) {
        // console.log("")
        await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { done_with_payment: isDoneWithPayment } })
    },
    SetDoneWithLeftover: async function (userId, isDoneWithLeftover) {
        await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { done_with_leftover: isDoneWithLeftover } })
    },
    UpdateUserIsReady: async function (userId, isReady) {

        await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { is_ready: isReady } })

        // TODO: Remove id field from result

        return await this.GetGroupByUser(userId)
    },
    UpdateUserChange: async function (userId, change) {
        await db.collection("users")
            .updateOne(
                { _id: new ObjectId(userId) },
                {
                    $set: {
                        change: change,
                    }
                })
    },
    IsGroupReadyByUser: async function (userId) {
        let group = await this.GetGroupByUser(userId)

        let isReady = true;
        group.forEach(user => {
            if (user.is_ready === false) {
                isReady = false;
            }
        })

        return isReady;
    },
    GetParentGroupId: async function (userId) {
        let dbParentGroupId = await db.collection("groups")
            .find({
                user_ids: { $in: [new ObjectId(userId)] }
            })
            .project({ _id: 1 })
            .toArray()

        console.log(dbParentGroupId[0])
        return dbParentGroupId[0]._id.toString();
    },
    GetGroupTip: async function (groupId) {
        let groupTip = await db.collection("groups")
            .find({ _id: new ObjectId(groupId) })
            .project({ tip_percent: 1 })
            .toArray()

        return groupTip[0].tip_percent;
    },
    GetGroupUserCount: async function (groupId) {
        // Counting the number of users in a group
        let dbResult = await db.collection("groups")
            .aggregate([
                {
                    $match: { _id: new ObjectId(groupId) }
                },
                {
                    $project: {
                        userCount: { $cond: { if: { $isArray: "$user_ids" }, then: { $size: "$user_ids" }, else: "NA" } }
                    }
                }

            ])
            .toArray()

        return dbResult[0].userCount;
    },
    UpdateChangeForParentGroup: async function (userId) {
        // Get users
        let usersInGroup = await this.GetGroupByUser(userId);

        // Get group data 
        let parentGroupId = await this.GetParentGroupId(userId);
        let userCount = await this.GetGroupUserCount(parentGroupId);
        let groupTip = await this.GetGroupTip(parentGroupId);


        // Update change for all users
        usersInGroup.forEach(async user => {
            let change = 0;

            // !
            change = user.amount - (groupTip / userCount + user.bill);// Deduct the individual tip from the payment
            change = +change.toFixed(2);//  Round to two decimal places



            await this.UpdateUserChange(user._id.toString(), change)
        })
    },
    // GetUsersWithNegativeChange: async function (groupId) {
    //     let group = await this.GetGroupByUser
    // }
    SubtractCreditorAmount: async function (creditorId, amount) {
        await db.collection("users")
            .updateOne({ _id: new ObjectId(creditorId) }, { $inc: { change: -amount } })
    },
    AddCreditorAmount: async function (creditorId, amount) {
        await db.collection("users")
            .updateOne({ _id: new ObjectId(creditorId) }, { $inc: { change: amount } })
    },

    IsGroupDoneWithLeftover: async function (groupId) {
        // this.GetGroupById
        let group = await this.GetGroupById(groupId)

        let isDoneWithLeftover = true;
        group.forEach(user => {
            if (user.done_with_leftover === false) {
                isDoneWithLeftover = false;
            }
        })

        return isDoneWithLeftover;
    },
    GetCreditorsForUser: async function (userId) {
        //from group get all users
        // let parentGroup = await this.GetGroupById(this.GetParentGroupId(userId))

        //  Get every document where the user is in debt
        // let creditors = await db.collection("debts")
        //     .find({ debtor_id: new ObjectId(userId) })
        //     .project({ _id: 0 })
        //     .toArray()

        // let creditors = await db.collection("debts").aggregate([
        //     {
        //         $lookup: {
        //             from: "users",
        //             localField: "creditor_id",
        //             foreignField: "user._id",
        //             as: "ds"
        //         }
        //     },
        //     {
        //         $project: {
        //             _id: 1,
        //             ds: {
        //                 "$filter": {
        //                     "input": "$ds",
        //                     "cond": {
        //                         $eq: [
        //                             "$$this.creditor_id",
        //                             new ObjectId(userId)
        //                             /* Filter value */
        //                         ]
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // ])

        // let creditors = await db.collection("users")
        // .find({ _id: new ObjectId(userId) })
        // .project({ creditors: 1 })
        // .toArray()
        // console.log("🚀 ~ file: helper.js:386 ~ creditor:", creditor)


        // if (creditors.length === 0) {
        //     return null;
        // }
        // else {
        //     return creditors
        // }
    },
    GetDebtorsForUser: async function (userId) {
        // let debtors = await db.collection("debts")
        //     .find({ creditor_id: new ObjectId(userId) })
        //     .project({ _id: 0 })
        //     .toArray()
        console.log("getting debtors")
        // ! Need to swap maybe the debtor id to creditor id...
        let debtors = await db.collection("debts").aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "debtor_id",
                    foreignField: "_id",
                    as: "deb"
                }
            },
            // {
            //     $match: {
            //         "deb._id": new ObjectId(userId)
            //     }
            // },
            {
                $unwind: "$deb"
            },
            {
                $project: {
                    "deb.username": 1,
                    "amount": 1
                }
            }]).toArray()



        // let debtors = await db.collection("debts").aggregate([
        //     {
        //         $lookup: {
        //             from: "users",
        //             localField: "debtor_id",
        //             foreignField: "_id",
        //             as: "deb"
        //         }
        //     },

        // ]).toArray()

        // console.log(debtors);
        console.log("🚀 497 ~ debtors:", debtors)

        if (debtors.length === 0) {
            return null;
        }
        else {
            return debtors
        }
    },
    EvalUserDebtState: async function (userId) {
        console.log("eval");
        let stateCount = await db.collection("users")
            .aggregate([
                {
                    $match: { _id: new ObjectId(userId) }
                },
                {
                    $project: {
                        creditorsCount: { $size: "$creditors" },
                        debtorsCount: { $size: "$debtors" }
                    }
                }
            ])
            .toArray()

        console.log("🚀 ~ file: helper.js:411 ~ stateCount[0]:", stateCount[0])
        if (stateCount[0].creditorsCount > 0 && stateCount[0].debtorsCount === 0) {
            return DEBT_STATE.DEBTOR;
        } else if (stateCount[0].creditorsCount === 0 && stateCount[0].debtorsCount > 0) {
            return DEBT_STATE.CREDITOR;
        } else {
            return DEBT_STATE.NO_DEBT;
        }
    }

}