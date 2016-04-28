var analyzer = {

    process: function(html) {

        function parseDate(messageDate) {
            return messageDate.split(" at ").join(" "); 
        }

        var nameDateMap = {};
        var threadNameDateMap = {};
        var nameCount = {};
        var nameMessageMap = {};

        var elements = $(html);

        $(elements).find(".thread").each(function (i, e) {
            var messageName;
            var messageDate;

            var threadName = $($(e)[0].firstChild).text();
            threadNameDateMap[threadName] = {};

            $(e).children().each(function (ind, elem) {
                var current = $(elem);

                if (ind % 2 === 0) {
                    // meta
                    var children = $(current.children()[0]).children();
                    messageName = $(children[0]).text();
                    var dateText = $(children[1]).text();
                    var parsedDate = parseDate(dateText);
                    messageDate = new Date(parsedDate);
                } else {
                    // message
                    var messageText = current.text();

                    _.update(nameCount, messageName, x => (x || 0) + 1);
        
                    _.update(nameMessageMap, messageName, x => _.concat((x || []), messageText));

                    _.update(nameDateMap, [messageName, messageDate], x => _.union(x, threadName));
                    
                    _.update(threadNameDateMap, [threadName, messageDate], x => 
                        _.concat({name: messageName, message: messageText}, (x || [])));
                }
            })
        });

        return {nameDateMap: nameDateMap, threadDateMap: threadNameDateMap, nameCount: nameCount, nameMessageMap: nameMessageMap}
    }
};

module.exports = analyzer;
