import { GetServerSideProps } from 'next'
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Field from '../components/ui/Field';
export default function Login() {
  const router = useRouter()
  // Méthode
  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    const resultat = await signIn('credentials', {
      email: e.target.email.value,
      password: e.target.password.value,
      redirect: false,
    });

    if (resultat?.error) {
      console.error(resultat.error);
    } else {
      router.replace('/');
    }
  };
  return <div className="container mt-5" >
    <form onSubmit={handleSubmit}>
      <Field type="email" name="email" error={null}>
        Email
      </Field>
      <Field type="password" name="password" error={null}>
        Mot de passe
      </Field>
      <input type="submit" />

    </form>
  </div>


}



export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (session) {
    return {
      redirect: {
        destination: '/projet',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
