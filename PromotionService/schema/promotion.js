const PromotionSchema = {
        //id: String,
        name: 'string',
        promotionType: 'string', ///enum: ["basic", "common", "epic"],
        startDate: 'date',
        endDate: 'date',
        userGroupName: 'string',
        // actions: ['Edit', 'Delete', 'Duplicate']
    };

const types = {
    0: "basic", 
    1: "common",
    2: "epic"
};

const userGroups = {
    0: "group0",
    1: "group1",
    2: "group2",
    3: "group3",
    4: "group4",
    5: "group5",
    6: "group6",
    7: "group7",
    8: "group8",
    9: "group9",
};

module.exports = {
    PromotionSchema,
    PromotionTypes: types,
    userGroups
};
