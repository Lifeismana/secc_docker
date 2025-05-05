#!/usr/bin/env node
import { parseDocument } from 'yaml';
import { readFile, writeFile } from 'fs';
import { join } from 'path';

let old_image = process.env.OLD_IMAGE;
let new_image = process.env.NEW_IMAGE;

if (!old_image || !new_image) {
    console.error('Missing environment variables: old_image, new_image');
    process.exit(1);
}

const filePath = join(__dirname, '../../', 'docker-compose.yml');

try {
    const file = readFile(filePath, 'utf8');
    const doc = parseDocument(file);
    const services = doc.get('services');
    const updateCount = 0;

    if (!services) {
        console.error('No services found in docker-compose.yml');
        return;
    }

    for (const [serviceName, service] of Object.entries(services)) {
        if (service.get('image')?.value?.endsWith(old_image)) {
            service.set('image', service.get('image')?.value.replace(old_image, new_image));
            console.log(`Updated ${serviceName} image to ${new_image}`);
            updateCount++;
        }
    }
    if (updateCount > 0) {
        writeFile(filePath, doc.toString());
        console.log(`Updated ${updateCount} services in docker-compose.yml`);
    }
    else {
        console.log('No services found with the specified old image');
    }
    
} catch (error) {
    console.error('Error updating docker-compose.yml:', error);
}