import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegisterForm from "./registerForm";

export default function AuthTabs() {
  return (
    <Tabs
      defaultValue="login"
      className="w-125 p-6 rounded-lg shadow-lg border"
    >
      <TabsList className="mb-4 grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        {/* Login form goes here */}
        <div>Login Form Placeholder</div>
      </TabsContent>
      <TabsContent value="register">
        {/* Register form goes here */}
        <RegisterForm />
      </TabsContent>
    </Tabs>
  );
}
