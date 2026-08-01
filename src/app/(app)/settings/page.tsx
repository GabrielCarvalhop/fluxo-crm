import { getSettingsData } from "@/lib/queries/settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/settings/profile-form";
import { TagsEditor } from "@/components/settings/tags-editor";
import { OptionListEditor } from "@/components/settings/option-list-editor";
import { TemplateCard } from "@/components/settings/template-card";
import { PipelineStagesEditor } from "@/components/settings/pipeline-stages-editor";
import { ChecklistEditor } from "@/components/settings/checklist-editor";

export default async function SettingsPage() {
  const data = await getSettingsData();

  const checklistGroups = data.checklistTemplate
    ? Array.from(new Set(data.checklistTemplate.items.map((i) => i.group_label))).map((label) => ({
        label,
        items: data.checklistTemplate!.items
          .filter((i) => i.group_label === label)
          .sort((a, b) => a.position - b.position),
      }))
    : [];

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-4 text-base font-medium text-foreground">Configurações</h1>

      <Tabs defaultValue="profile">
        <TabsList className="flex-wrap">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="options">Tags e Opções</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="pt-4">
          <ProfileForm fullName={data.profile?.full_name ?? ""} email={data.profile?.email ?? ""} />
        </TabsContent>

        <TabsContent value="pipeline" className="pt-4">
          <PipelineStagesEditor stages={data.stages} />
        </TabsContent>

        <TabsContent value="options" className="flex flex-col gap-6 pt-4">
          <TagsEditor tags={data.tags} />
          <OptionListEditor table="segments" title="Segmentos" items={data.segments} />
          <OptionListEditor table="lead_sources" title="Origens" items={data.sources} />
          <OptionListEditor table="loss_reasons" title="Motivos de perda" items={data.lossReasons} />
        </TabsContent>

        <TabsContent value="templates" className="pt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {data.templates.map((t) => (
              <TemplateCard key={t.id} template={t} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="checklist" className="pt-4">
          {data.checklistTemplate ? (
            <ChecklistEditor templateId={data.checklistTemplate.id} groups={checklistGroups} />
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum template padrão encontrado.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
