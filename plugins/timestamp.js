const { formatInTimeZone } = require("date-fns-tz")

const timestamp = (schema, options) => {
    schema.add({ createdAt: String })
    schema.add({ updatedAt: String })
    schema.add({
        tz: {
            type: String,
            default: 'Asia/Kolkata'
        }
    })
    schema.add({
        deletedAt: {
            type: String,
            default: 'N/A'
        }
    })
    schema.add({
        isDeleted: {
            type: Boolean,
            default: false
        }
    })

    const value = {
        currentTime: () => formatInTimeZone(new Date(), 'Asia/Kolkata', 'dd/MM/yyyy hh:mm:ss')
    }

    schema.set('timestamps', value)

    async function softDelete(_id) {
        console.log(this, _id)
        try {
            // const doc = await this.updateOne({ _id: _id }, {
            //     isDeleted: true,
            //     deletedAt: formatInTimeZone(new Date(), 'Asia/Kolkata', 'dd/MM/yyyy hh:mm:ss')
            // })

            let doc = await this.findById(_id) || {};
            if (!Object.keys(doc).length || doc?.isDeleted) {
                return {
                    error: true
                }
            }

            doc.isDeleted = true;
            doc.deletedAt = formatInTimeZone(new Date(), 'Asia/Kolkata', 'dd/MM/yyyy hh:mm:ss');
            await doc.save()

            return {
                error: false
            }
        }
        catch (err) {
            console.log(err)
            return {
                error: true,
            }
        }
    }

    schema.static('softDelete', softDelete)

    const typesFindQueryMiddleware = [
        'count',
        'find',
        'findOne',
        'findOneAndDelete',
        'findOneAndRemove',
        'findOneAndUpdate',
        'update',
        'updateOne',
        'updateMany',
    ];

    const excludeInFindQueriesIsDeleted = async function (next) {
        this.where({ isDeleted: false });
        next();
    };

    typesFindQueryMiddleware.forEach((type) => {
        schema.pre(type, excludeInFindQueriesIsDeleted);
    });
}

module.exports = timestamp