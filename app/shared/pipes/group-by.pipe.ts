import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {
    transform(collection: Array<any>, property: string): Array<any> {
        if (!collection) {
            return null;
        }

        const groupedCollection = collection.reduce((previous, current) => {
            if (property.split('.').length > 1) {
                let arr = property.split('.');

                let caminhoDoPai = arr.join('.');
                let key = this.getFrom(caminhoDoPai, current)

                if (!previous[key]) {
                    previous[key] = [current];
                } else {
                    previous[key].push(current);
                }
            } else {
                if (!previous[current[property]]) {
                    previous[current[property]] = [current];
                } else {
                    previous[current[property]].push(current);
                }
            }

            return previous;
        }, {});
        return Object.keys(groupedCollection).map(key => ({ key, value: groupedCollection[key] }));
    }


    private getFrom(path: string, obj) {
        return path.split('.').reduce((p, c) => { return p ? p[c] : null }, obj || self)
    }

}
