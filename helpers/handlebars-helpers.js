const moment = require('moment');

module.exports={

    //whichever was selected before will be there in the placeholder
    select: function(selected, options){
        return options.fn(this).replace(new RegExp(' value=\"'+ selected + '\"'), '$&selected="selected"');
    },

    generateDate: function(date,format){
        return moment(date).format(format);

    }

};