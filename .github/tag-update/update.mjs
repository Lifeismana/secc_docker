#!/usr/bin/env node
import { parseDocument, visit } from 'yaml';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const TO_STRING_OPT = {lineWidth: 0};

const filePath = join(dirname(fileURLToPath(import.meta.url)), '../../', 'docker-compose.yml');


try {
    const file = readFileSync(filePath, 'utf8');
    const doc = parseDocument(file);

    // let's also use this to lint the file if this gets launched with the lint parameter
    if (process.argv.includes('lint')) {
        
        console.log('Linting docker-compose.yml...');
        writeFileSync(filePath, doc.toString(TO_STRING_OPT));

    } else {

        let old_image = process.env.OLD_IMAGE;
        let new_image = process.env.NEW_IMAGE;

        if (old_image.startsWith('library/')) {
            old_image = old_image.replace('library/', '');
        }
        if (new_image.startsWith('library/')) {
            new_image = new_image.replace('library/', '');
        }

        console.log('Updating docker-compose.yml...');
        console.log('Old image:', old_image);
        console.log('New image:', new_image);

        if (!old_image || !new_image) {
            console.error('Missing environment variables: old_image, new_image');
            process.exit(1);
        }
        if (old_image === new_image) {
            console.error('Old image and new image are the same');
            process.exit(1);
        }
        const services = doc.contents.get('services');
        let updateCount = 0;
        
        visit(doc, {
            Pair(_, node, path) {
                if(path.length > 6){
                    return visit.SKIP;
                }
                if (path[2]?.key.value === 'services' && typeof path[4]?.key.value === 'string' && node.key.value === 'image') {
                    const nodeString = node.value?.toString();
                    if (nodeString.endsWith(old_image)) {
                        node.value = nodeString.replace(old_image, new_image);
                        updateCount++;
                        return node;
                    }
                }
            }
        })
        if (updateCount > 0) {
            writeFileSync(filePath, doc.toString(TO_STRING_OPT));
            console.log(`Updated ${updateCount} services in docker-compose.yml`);
        }
        else {
            console.log('No services found with the specified old image');
        }
    }
    
} catch (error) {
    console.error('Error updating docker-compose.yml:', error);
}