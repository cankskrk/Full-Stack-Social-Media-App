import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"



import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignUpValidationSchema } from "@/lib/validation"
import { z } from "zod"
import Loader from "@/components/shared/Loader"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"

const SignUpForm = () => {

  const navigate = useNavigate()
  const { toast } = useToast()
  const { checkAuthUser } = useUserContext()
  const { mutateAsync: createUserAccount, isLoading: isCreatingAccount } = useCreateUserAccount()
  const { mutateAsync: signInAccount } = useSignInAccount()

  const form = useForm<z.infer<typeof SignUpValidationSchema>>({
    resolver: zodResolver(SignUpValidationSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })
 
  async function onSubmit(values: z.infer<typeof SignUpValidationSchema>) {
    const newUser = await createUserAccount(values)

    if(!newUser) {
      return toast({
        title: 'Sign up failed. Please try again.'
      })
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })

    if(!session) {
      return toast({title: 'Sign in failed. Please try again.'})
    }

    const isLoggedIn = await checkAuthUser()

    if(isLoggedIn) {
      form.reset()

      navigate('/')
    } else {
      return toast({title: 'Sign up failed. Please try again.'})
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />

        <h2 className="h4-bold md:h3-bold pt-5 sm:pt-8">Create a new account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-4">To use Snapgram, please enter your account details</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 w-full mt-3 space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="shad-button_primary" type="submit">
            {isCreatingAccount ? (
              <div className="flex-center gap-2"><Loader /> Loading...</div>
            ) : "Sign up"}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">Log in</Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignUpForm