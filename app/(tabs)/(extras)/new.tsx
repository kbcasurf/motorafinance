import { useRouter } from 'expo-router';
import { ExtrasForm } from '../../../src/components/forms/ExtrasForm';
import { insertExtra } from '../../../src/db/queries/extras';
import type { NewExtra } from '../../../src/db/queries/extras';

export default function NewExtraScreen() {
  const router = useRouter();

  async function handleSubmit(data: NewExtra) {
    await insertExtra(data);
    router.back();
  }

  return <ExtrasForm onSubmit={handleSubmit} submitLabel="Registrar" />;
}
