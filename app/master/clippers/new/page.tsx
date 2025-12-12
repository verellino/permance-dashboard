import { ClipperForm } from './clipper-form';
import { getWorkspacesByType } from '@/lib/models/workspace';
import { ObjectId } from 'mongodb';

function serializeObjectId(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (obj instanceof ObjectId) {
    return obj.toString();
  }
  
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(serializeObjectId);
  }
  
  if (typeof obj === 'object') {
    const serialized: any = {};
    for (const key in obj) {
      serialized[key] = serializeObjectId(obj[key]);
    }
    return serialized;
  }
  
  return obj;
}

export default async function NewClipperPage() {
  const clientWorkspaces = await getWorkspacesByType('CLIENT', { limit: 100 });
  
  const clients = clientWorkspaces.map((w: any) => {
    const serialized = serializeObjectId(w);
    return {
      _id: serialized._id,
      name: serialized.name
    };
  });

  return <ClipperForm clients={clients} />;
}
